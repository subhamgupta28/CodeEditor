import { TreeView, TreeItem } from "@mui/lab";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";

function ProjectExplorer({ onFileSelect }) {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/code/list").then((res) => {
            setFiles(res.data);
        });
    }, []);

    const renderTree = (nodes) => {
        return nodes.map((file, index) => (
            <TreeItem
                key={index}
                nodeId={file.name}
                label={file.name}
                onClick={() => onFileSelect(file.name)}
            />
        ));
    };

    return (
        <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
        >
            {renderTree(files)}
        </TreeView>
    );
}

export default ProjectExplorer;
