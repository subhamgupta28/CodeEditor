import {Grid, Button, Stack, Divider} from "@mui/material";
import CodeEditor from "../components/CodeEditor";
import ProjectExplorer from "../components/ProjectExplorer";
import { useState } from "react";
import axios from "axios";

function EditorPage() {
    const [editorContent, setEditorContent] = useState("");
    const [currentFile, setCurrentFile] = useState("");


    const saveCode = async () => {
        if (!currentFile) return alert("No file selected!");
        await axios.post("http://localhost:8011/api/code/save", {
            code: editorContent,
            file: currentFile,
        });
        alert("File saved!");
    };

    const buildCode = async () => {
        const res = await axios.post("http://localhost:8011/api/code/build");
        alert(`Build finished with exit code ${res.data.exitCode}`);
    };

    const uploadCode = async () => {
        const res = await axios.post("http://localhost:8011/api/code/upload");
        alert(`Upload finished with exit code ${res.data.exitCode}`);
    };

    const handleFileOpen = async (filename) => {
        const res = await axios.get(`http://localhost:8011/api/code/open?file=${encodeURIComponent(filename)}`);
        setEditorContent(res.data.content);
        setCurrentFile(filename);
    };

    return (
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem/>}>
            <div style={{width: '20%'}}>
                <ProjectExplorer onFileSelect={handleFileOpen} />
            </div>
            <div style={{width: '80%'}}>
                <CodeEditor value={editorContent} onChange={setEditorContent} />
                <Stack direction="row" spacing={2} mt={2}>
                    <Button variant="contained" onClick={saveCode}>Save</Button>
                    <Button variant="contained" onClick={buildCode}>Build</Button>
                    <Button variant="contained" onClick={uploadCode}>Upload</Button>
                </Stack>
            </div>
        </Stack>
    );
}

export default EditorPage;
