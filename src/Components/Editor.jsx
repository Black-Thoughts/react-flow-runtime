import {useState} from 'react'
import { useReactFlow, useNodesData } from "@xyflow/react";

export const Editor = ({nodeId, setVisible}) => {
 

    const node = useNodesData(nodeId)
    const {updateNodeData} = useReactFlow();

    const isValidFileType = (type) => {
        switch (node.type) {
            case 'imageNode':
                return type.startsWith('image/');
            case 'videoNode':
                return type.startsWith('video/');
            case 'audioNode':
                return type.startsWith('audio/');
        }

        return true;
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return
        if (!isValidFileType(file.type)) {
            alert(`File must be of type ${node.type.slice(0, -4)}`);
            return;
        }
        const imageUrl = URL.createObjectURL(file);

        updateNodeData(nodeId, {url: imageUrl});

        e.target.value = '';
    }

    return (
        <div className='editor'>
            <h1>{nodeId}</h1>
            <input type='text' value={node?.data.label ?? ""} placeholder='Label' onChange={(e) => updateNodeData(nodeId, {label: e.target.value})}/>
            <br></br>
            { node.data.url && 
                <div>
                    <label>
                        Type in a link
                    <input type='text' value={node?.data.url ?? ""} placeholder='Url' onChange={(e) => updateNodeData(nodeId, {url: e.target.value})}/>

                    </label>
                    <br/>
                    <br/>
                    {node.type != 'iFrameNode' && <label>
                        Or add your own file
                    <input type='file' onChange={handleFileChange}/>
                    </label>}
                </div>
            }
            <br></br>
            { node.data.text && <input type='text-area' value={node?.data.text ?? ""} placeholder='Text' onChange={(e) => updateNodeData(nodeId, {text: e.target.value})}/>}

            <br></br>
            <br></br>
            <button onClick={setVisible}>Close Editor</button>
            {/* <div className='editorItem'>Add Node
                <div className='editorSubItem'>Text Node</div>
                <div className='editorSubItem'>Image Node</div>
                <div className='editorSubItem'>Video Node</div>
                <div className='editorSubItem'>Audio Node</div>
                <div className='editorSubItem'>Web Node</div>
            </div>
            <div className='editorItem'>Delete Node</div>
            <div className='editorItem'>Update Node</div> */}
        </div>
    )
};