def consolidate_node_info(graph):
    node_data = {}

    for node in graph:
        node_id = node["id"]
        node_data[node_id] = {
            "label": node["label"],
            "type": node["type"],
            "outgoing_edges": [],
            "incoming_edges": []
        }
