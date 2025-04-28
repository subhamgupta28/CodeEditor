import Editor from "@monaco-editor/react";

function CodeEditor({ value, onChange,extension }) {
    return (
        <div style={{ height: "85dvh", borderRadius: "8px" }} >
            <Editor
                height="100%"
                defaultLanguage="cpp"
                language={extension}
                theme="vs-dark"
                value={value}
                onChange={(value) => onChange(value)}
            />
        </div>
    );
}

export default CodeEditor;
