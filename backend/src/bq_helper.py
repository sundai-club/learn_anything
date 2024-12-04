import logging
import os

from google.cloud import bigquery
from google.cloud.bigquery import SchemaField

# Configure logging
logging.basicConfig(level=logging.INFO)

SERVICE_ACCOUNT_PATH = "/path/to/your/service-account-key.json"
PROJECT_ID = "sundai-club-434220-project-id"
DATASET_ID = "learn_anything"
TABLE_ID = "wiki_info"

# Set the environment variable for Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = SERVICE_ACCOUNT_PATH

client = bigquery.Client()


def insert_row_if_not_exists(
    client,
    project_id,
    dataset_id,
    table_id,
    row_data,
    unique_columns
):
    """
    Inserts a row into BigQuery if it does not already exist based on unique columns.
    """
    table_ref = f"{project_id}.{dataset_id}.{table_id}"
    where_conditions = " AND ".join([f"{col} = @{col}" for col in unique_columns])
    existence_query = f"""
    SELECT COUNT(*) as row_count
    FROM `{table_ref}`
    WHERE {where_conditions}
    """

    try:
        query_params = {
            col: row_data.get(col)
            for col in unique_columns
        }

        query_job = client.query(
            existence_query,
            job_config=bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter(name,
                                                  "STRING",
                                                  value)
                    for name, value in query_params.items()
                ]
            ),
        )

        results = list(query_job)
        if results[0].row_count > 0:
            logging.info("Row already exists. Skipping insertion.")
            return False

        table = client.get_table(table_ref)
        errors = client.insert_rows_json(table, [row_data])

        if errors:
            logging.error(f"Errors inserting row: {errors}")
            return False

        logging.info("Row inserted successfully.")
        return True

    except Exception as e:
        logging.error(f"An error occurred while inserting the row: {e}")
        return False


def save_graph_to_bq(user_id, url, graph):
    """
    Saves a graph to BigQuery for the specified user and URL.
    """
    row_data = {
        "user_id": user_id,
        "url": url,
        "graph": graph
    }
    success = insert_row_if_not_exists(
        client,
        PROJECT_ID,
        DATASET_ID,
        TABLE_ID,
        row_data,
        unique_columns=["user_id"]
    )
    if success:
        logging.info("Graph saved to BigQuery")


def get_graph_from_bq(user_id, url):
    """
    Retrieves a graph from BigQuery based on the user ID and URL.
    """
    query = f"SELECT graph FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}` WHERE user_id = '{user_id}' AND url = '{url}'"
    try:
        query_job = client.query(query)
        results = list(query_job)
        if len(results) == 0:
            logging.info("No graph found for the specified user ID and URL.")
            return None
        return results[0].graph
    except Exception as e:
        logging.error(f"An error occurred while retrieving the graph: {e}")
        return None


def save_wiki_info_to_bq(url, wiki_info):
    """
    Saves wiki information to BigQuery for the specified URL.
    """
    row = {
        "url": url,
        "wiki_info": wiki_info
    }
    success = insert_row_if_not_exists(
        client,
        PROJECT_ID,
        DATASET_ID,
        TABLE_ID,
        row,
        unique_columns=["url"]
    )
    if success:
        logging.info("Wiki info saved to BigQuery")


def get_wiki_info_from_bq(url):
    """
    Retrieves wiki information from BigQuery.
    """
    query = f"SELECT wiki_info FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}` WHERE url = '{url}'"
    try:
        query_job = client.query(query)
        results = list(query_job)
        if len(results) == 0:
            logging.info("No wiki info found in the table.")
            return None
        return results[0].wiki_info
    except Exception as e:
        logging.error(f"An error occurred while retrieving wiki info: {e}")
        return None
