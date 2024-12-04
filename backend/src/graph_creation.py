#!/usr/bin/env python3

import argparse
import graphlib
import json
import os
import sys

import matplotlib.pyplot as plt
import networkx as nx

if sys.version_info < (3, 10):
    sys.exit("Python 3.10 or higher is required to run this script")

ROOT = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)),
                 "../../")
)
data_dir = os.path.join(ROOT, "backend/data")
results_dir = os.path.join(ROOT, "backend/results")


def parse_args() -> argparse.Namespace:
    """
    Create graph from a json file in the data directory
    python3 graph_creation.py
    (venv) /.../learn_anything/ ./backend/src/graph_creation.py
    """
    parser = argparse.ArgumentParser(description="Create a graph from a json file")
    parser.add_argument(
        "--data_dir",
        type=str,
        default=data_dir,
        help="The fullpath to the data directory"
    )
    parser.add_argument(
        "--json_file",
        type=str,
        default="AI Research.json",
        help="The json file name in the data directory"
    )
    arguments = parser.parse_args()
    return arguments


class Node:

    def __init__(self) -> None:
        self.name: str = ""
        self.root: bool = False
        self.abbrev: str = ""
        self.desc: str = ""
        self.parents: list = []
        self.children: list = []
        self.complete: bool = False  # checkbox in gui
        self.links: list = []
        self.weight: float = 0.0
        self.depth: int = 0  # root = 0

    def add_child(self, node) -> None:
        self.children.append(node)
        node.depth = self.depth + 1
        node.parents.append(self)
        node.complete = False

    def add_parent(self, node) -> None:
        if self.root:
            raise ValueError("Root node cannot have a parent")
        self.parents.append(node)
        node.children.append(self)
        node.complete = False

    def add_link(self, link):
        self.links.append(link)

    def is_complete(self) -> bool:
        return self.complete

    def mark_complete(self) -> None:
        self.complete = True

    def __str__(self) -> str:
        return self.name


class Link:

    def __init__(self) -> None:
        self.name: str = ""
        self.url: str = ""
        self.desc: str = ""

    def __str__(self) -> str:
        return self.name


def read_json_file(json_path: str) -> dict:
    """
    read json file and return a dictionary
    """
    with open(json_path, "r") as file:
        data = json.load(file)

    return data


def create_graph(data: dict) -> nx.DiGraph:
    """
    format of json file:
    {
    "name": "AI Research",
    "value": "AI",
    "desc": "Exploring artificial intelligence through advanced research and practical applications.",
    "children": [
        { ...
    """
    graph = nx.DiGraph()

    def process_node(node_data: dict, depth: int = 0) -> None:
        name = node_data.get("name", "")
        desc = node_data.get("desc", "")

        # Add node with its attributes
        graph.add_node(name, description=desc, depth=depth)

        # Process children
        children = node_data.get("children", [])
        for child in children:
            child_name = child.get("name", "")
            graph.add_node(
                child_name,
                description=child.get("desc",
                                      ""),
                depth=depth + 1
            )
            graph.add_edge(name, child_name)
            process_node(child, depth + 1)

    # Process the root node
    process_node(data)
    return graph


def display_graph(g: nx.DiGraph) -> None:
    """
    display graph with labels for each node, arranged by depth levels
    """
    plt.figure(figsize=(24, 16))  # Increased figure size

    # Group nodes by depth
    depth_groups = {}
    for node in g.nodes():
        depth = g.nodes[node]["depth"]
        if depth not in depth_groups:
            depth_groups[depth] = []
        depth_groups[depth].append(node)

    pos = {}
    max_depth = max(depth_groups.keys())
    max_nodes_at_any_depth = max(len(nodes) for nodes in depth_groups.values())

    # Calculate width scale based on maximum number of nodes at any level
    width_scale = max(2.0, max_nodes_at_any_depth * 0.3)

    for depth, nodes in depth_groups.items():
        # Increase vertical separation
        y = 1 - (depth / (max_depth + 0.5))  # Added 0.5 for more vertical space

        # Center nodes horizontally and scale width based on number of nodes
        width = width_scale
        for i, node in enumerate(nodes):
            # Distribute nodes evenly across the width
            x = ((i + 1) * width / (len(nodes) + 1)) - (width / 2)
            pos[node] = (x, y)

    # Draw the graph
    # Draw edges first
    nx.draw_networkx_edges(
        g,
        pos=pos,
        edge_color="lightgray",
        width=2,
        arrowsize=25,
        alpha=0.6
    )

    # Draw nodes
    nx.draw_networkx_nodes(
        g,
        pos=pos,
        node_color="skyblue",
        node_size=6000,  # Increased node size
        alpha=0.9,
        linewidths=2,
        edgecolors="white",
    )

    # Draw labels with word wrapping
    labels = {}
    for node in g.nodes():
        # Split long node names into multiple lines
        words = node.split()
        lines = []
        current_line = []

        for word in words:
            current_line.append(word)
            if len(" ".join(current_line)
                   ) > 20:  # Adjust this value to control line length
                lines.append(" ".join(current_line[:-1]))
                current_line = [word]

        if current_line:
            lines.append(" ".join(current_line))

        labels[node] = "\n".join(lines)

    nx.draw_networkx_labels(
        g,
        pos=pos,
        labels=labels,
        font_size=10,
        font_weight="bold",
        font_family="sans-serif"
    )

    # Add depth level labels
    for depth in depth_groups:
        plt.text(
            -width_scale / 2,  # Adjusted x position based on width scale
            1 - (depth / (max_depth + 0.5)),  # Match the adjusted y-coordinate
            f"Level {depth}",
            horizontalalignment="right",
            verticalalignment="center",
            fontsize=12,
            fontweight="bold",
        )

    plt.title(
        "Knowledge Graph (arranged by depth)",
        pad=20,
        fontsize=14,
        fontweight="bold"
    )
    plt.margins(x=0.2, y=0.2)  # Increased margins

    # Remove axes
    plt.axis("off")

    plt.tight_layout()  # Adjust layout to use full figure size
    plt.show()


def topological_sort(g: nx.DiGraph) -> nx.DiGraph:
    """
    topological sort of a graph, add in future
    """
    sorted_nodes = list(nx.topological_sort(g))
    sorted_graph = nx.DiGraph()

    # Add nodes in sorted order
    for node in sorted_nodes:
        sorted_graph.add_node(node, **g.nodes[node])

    # Add edges
    for edge in g.edges():
        sorted_graph.add_edge(*edge)

    return sorted_graph


def save_graph(g: nx.DiGraph) -> None:
    """
    save graph to file
    """
    if not os.path.exists(results_dir):
        os.makedirs(results_dir, exist_ok=True)
    graph_location = os.path.join(results_dir, "graph.gexf")
    nx.write_gexf(g, graph_location)
    print(f"Graph saved to {graph_location}")


if __name__ == "__main__":

    args = parse_args()

    json_file = os.path.join(args.data_dir, args.json_file)

    for fullpath in [ROOT, data_dir, json_file]:
        if not os.path.exists(fullpath):
            raise ValueError(f"File {fullpath} does not exist")
        print(f"Path {fullpath} found")

    # scrape json file to build graph
    json_dict = read_json_file(json_file)
    graph_standard = create_graph(json_dict)
    graph_topo_sorted = topological_sort(create_graph(json_dict))

    display_graph(graph_standard)
    # display_graph(graph_topo_sorted)

    # save graph (optional)
    save_graph(graph_standard)
    # save_graph(graph_topo_sorted)
