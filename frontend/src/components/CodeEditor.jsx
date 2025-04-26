import Editor from "@monaco-editor/react";

function CodeEditor({ value, onChange }) {
    return (
        <div style={{ height: "600px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <Editor
                height="100%"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={value}
                onChange={(value) => onChange(value)}
            />
        </div>
    );
}

export default CodeEditor;
