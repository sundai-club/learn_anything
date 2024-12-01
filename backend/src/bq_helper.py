from google.cloud import bigquery
from google.cloud.bigquery import SchemaField
import os

client = bigquery.Client()


def connect_to_bigquery(service_account_path):
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = service_account_path
    return bigquery.Client()

def insert_row_if_not_exists(client, project_id, dataset_id, table_id, row_data, unique_columns):
    # Fully qualified table reference
    table_ref = f"{project_id}.{dataset_id}.{table_id}"
    
    # Construct the existence check query
    where_conditions = ' AND '.join([f"{col} = @{col}" for col in unique_columns])
    existence_query = f"""
    SELECT COUNT(*) as row_count 
    FROM `{table_ref}` 
    WHERE {where_conditions}
    """
    
    # Prepare query parameters
    query_params = {}
    for col in unique_columns:
        query_params[col] = row_data.get(col)
    
    # Run existence check
    query_job = client.query(
        existence_query, 
        job_config=bigquery.QueryJobConfig(query_parameters=[
            bigquery.ScalarQueryParameter(name, 'STRING', value) 
            for name, value in query_params.items()
        ])
    )
    
    # Check if row exists
    results = list(query_job)
    if results[0]['row_count'] > 0:
        print(f"Row already exists. Skipping insertion.")
        return False
    
    # If row doesn't exist, insert the row
    table = client.get_table(table_ref)
    errors = client.insert_rows_json(table, [row_data])
    
    if errors:
        print(f"Errors inserting row: {errors}")
        return False
    
    print("Row inserted successfully.")
    return True

def create_example_table(client, project_id, dataset_id, table_id):
    table_ref = f"{project_id}.{dataset_id}.{table_id}"
    
    # Define table schema
    schema = [
        SchemaField('user_id', 'STRING', mode='REQUIRED'),
        SchemaField('email', 'STRING', mode='REQUIRED'),
        SchemaField('name', 'STRING', mode='NULLABLE'),
        SchemaField('created_at', 'TIMESTAMP', mode='REQUIRED')
    ]
    
    # Create table
    table = bigquery.Table(table_ref, schema=schema)
    table = client.create_table(table, exists_ok=True)
    print(f"Table {table_id} created or already exists.")

def main():
    # Replace with your actual paths and IDs
    SERVICE_ACCOUNT_PATH = '/path/to/your/service-account-key.json'
    PROJECT_ID = 'your-project-id'
    DATASET_ID = 'your_dataset'
    TABLE_ID = 'users'
    
    try:
        # Connect to BigQuery
        client = connect_to_bigquery(SERVICE_ACCOUNT_PATH)
        
        # Create example table (optional)
        create_example_table(client, PROJECT_ID, DATASET_ID, TABLE_ID)
        
        # Example row to insert
        row_data = {
            'user_id': 'user123',
            'email': 'john.doe@example.com',
            'name': 'John Doe',
            'created_at': bigquery.TIMESTAMP_NOW
        }
        
        # Attempt to insert row (prevent duplicates based on user_id)
        insert_row_if_not_exists(
            client, 
            PROJECT_ID, 
            DATASET_ID, 
            TABLE_ID, 
            row_data, 
            unique_columns=['user_id']
        )
        
        # Try to insert the same row again (should be skipped)
        insert_row_if_not_exists(
            client, 
            PROJECT_ID, 
            DATASET_ID, 
            TABLE_ID, 
            row_data, 
            unique_columns=['user_id']
        )
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    main()