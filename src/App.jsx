import {ReactFlow, addEdge, useEdgesState, useNodesState, Background, Controls, useReactFlow, ReactFlowProvider, applyNodeChanges, ViewportPortal} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {nanoid} from 'nanoid'
import {Editor} from './Components/Editor'
import { VideoNode } from './Components/Nodes/VideoNode';
import { AudioNode } from './Components/Nodes/AudioNode';
import { ImageNode } from './Components/Nodes/ImageNode';
import { TextNode } from './Components/Nodes/TextNode';
import { IFrameNode } from './Components/Nodes/IFrameNode';
import '@xyflow/react/dist/style.css';
import './App.css';

const nodeTypes = { 
  videoNode: VideoNode,
  audioNode: AudioNode,
  imageNode: ImageNode,
  textNode: TextNode,
  iFrameNode: IFrameNode,
};

const initialNodes = [];
const initialEdges = [];

function FlowEditor() {
  const [initNodes, setInitNodes] = useNodesState(initialNodes);
  const [initEdges, setInitEdges] = useEdgesState(initialEdges);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isEditing, setIsEditing] = useState(true);
  const [editNode, setEditNode] = useState(null);
  const lastClickTime = useRef(0);
  const {screenToFlowPosition} = useReactFlow();
  const [dblclkPos, setDblClkPos] = useState(null);
  const popupRef = useRef(null);


  window.addEventListener('message', (message) => {
    // if (loaded) return;
    if (!message.data.nodes && !message.data.isEditing) return;

    console.log(message.data);
    // alert(message.data);

    if (message.data.isEditing) {
      setIsEditing(message.data.isEditing);
    }
    if (message.data.nodes) {
      setNodes(message.data.nodes);
      setEdges(message.data.edges);

      setInitNodes(message.data.nodes);
      setInitEdges(message.data.edges);
    }
 
    // setLoaded(true);
  })

  const sendData = useCallback(()=> {
    const data = {nodes: nodes, edges: edges}
    window.parent.postMessage(data, '*');
  }, [nodes, edges])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const resetTemplate = () => {
    setNodes(initNodes);
    setEdges(initEdges);
  }

  const createNode = (nodeType) => {
    const newNode = {
      id: nanoid(),
      type: nodeType,
      position: dblclkPos,
      data: {label: `New Node`, url: ""},
    }

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setEditNode(newNode);
    console.log(newNode.id);

    popupRef.current.style.display = 'none';
  }

  const onPaneDoubleClick = useCallback((e) => {
    if (!isEditing) return;

    console.log("double click");
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    })
    setDblClkPos(position);

    const popup = popupRef.current;
    popup.style.left = `${e.clientX}px`;
    popup.style.top = `${e.clientY}px`;
    popup.style.display = 'block';

  }, [screenToFlowPosition])

  const onPaneClick = useCallback((e) => {
    console.log('pane click');
    const now = Date.now();
    
    popupRef.current.style.display = 'none';

    if (now - lastClickTime.current < 300) {
      console.log('pane double click');
      onPaneDoubleClick(e);
      return;
    }

    lastClickTime.current = now;

  }, [onPaneDoubleClick])

  const onNodeDoubleClick = (e, node) => {
    console.log(node);
    if (isEditing) setEditNode(node);
  }

  return (
    <div id='container'>
      <ReactFlow nodes={nodes} edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      noWheelClassName='text-node, iframe-node'
      onPaneClick={onPaneClick}
      onNodeDoubleClick={onNodeDoubleClick}
      >

      <Controls/>
      </ReactFlow>
                <Background/>

      {editNode && <Editor nodeId={editNode.id} setVisible={() => setEditNode(null)}/>}
      {
        isEditing &&
        <>
          <div ref={popupRef} className='popup' style={{display: 'none'}}>
            <div className='item' onClick={() => createNode('textNode')}>Text Node</div>
            <div className='item' onClick={() => createNode('imageNode')}>Image Node</div>
            <div className='item' onClick={() => createNode('videoNode')}>Video Node</div>
            <div className='item' onClick={() => createNode('audioNode')}>Audio Node</div>
            <div className='item' onClick={() => createNode('iFrameNode')}>Web Node</div>
          </div>
          <button className='editButton' onClick={resetTemplate}>Reset</button>
          <button className='editButton' onClick={sendData}>Save</button>
        </>     
      }
    </div>
  );
}

const App = () => {

  return (
    <>
      <ReactFlowProvider>
        <FlowEditor/>
      </ReactFlowProvider>
    </>
  );
};

export default App;