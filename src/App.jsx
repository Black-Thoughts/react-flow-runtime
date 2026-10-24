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

const initialEdges = [{id: "e1-2", source: "1", target: "2"}];

function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isEditing] = useState(true);
  const [editNode, setEditNode] = useState(false);
  const lastClickTime = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const {screenToFlowPosition} = useReactFlow();


  window.addEventListener('message', (message) => {
    if (loaded) return;
    if (!message.data.nodes) return; 

    console.log(message.data);
    // alert(message.data);
    setNodes(message.data.nodes);
    setEdges(message.data.edges);
    setLoaded(true);
  })

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onPaneDoubleClick = useCallback((e) => {
    if (!isEditing) return;

    console.log("double click");
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    })

    const newNode = {
      id: nanoid(),
      type: 'textNode',
      position,
      data: {label: 'New Node', text: "Testing testing 123"},
    }

    setNodes((prevNodes) => [...prevNodes, newNode])
  }, [screenToFlowPosition, setNodes])

  const onPaneClick = useCallback((e) => {
    console.log('pane click');
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      console.log('pane double click');
      onPaneDoubleClick(e);
    }

    lastClickTime.current = now;
  }, [onPaneDoubleClick])

  const onNodeDoubleClick = (e, node) => {
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
      {editNode && <Editor nodeId={editNode.id} setVisible={() => setEditNode(null)}/>}
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