import React, { useState, useEffect, useRef, useContext } from "react";
import SvgIcon from "@mui/material/SvgIcon";
import TreeView from "@mui/lab/TreeView";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import * as apiService from "services/apiService";
import { Link, useParams } from "react-router-dom";
import ContextMenu from "../ContextMenu";
import "./index.css";
import StyledTreeItem from "./styledTreeItem";
import JournalNewModal from "../JournalNewModal";
import JounralDeleteDialog from "../JounralDeleteDialog";
import JournalRenameModal from "Components/JournalRenameModal";
import { JournalTreeContext } from "Components/JournalContext/index.js";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

export default function CustomizedTreeView({ setSelectedTreeNode, selectedTreeNode }) {
  const [expanded, setExpanded] = useState([]);
  const [root, setRoot] = useState(null);
  const params = useParams();

  const [newModalOpen, setNewModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const journalTreeContext = useContext(JournalTreeContext);

  const containerRef = useRef(null);

  const fetchData = async () => {
    const r = await apiService.getTree();
    console.log(r);

    journalTreeContext.setJournalTree(r);
    if (r != null) {
      setRoot(r);

      getNodePath(r[0], params.TreeId);
    }
  };
  const getNodePath = (node, targetId) => {
    if (targetId == null) return [];
    debugger;

    if (node != null) {
      if (node.id === targetId) {
        var result = [];
        result = result.concat([targetId.toString()]);
        return result;
      } else {
        for (let n of node.nodes) {
          //node.nodes.forEach(x=>{
          var chain = getNodePath(n, targetId);
          if (chain != null) {
            var finalResult = chain.concat(node.id.toString());
            setExpanded(finalResult);
            return finalResult;
          }
        }
      }
    } else {
      return [];
    }
  };

  useEffect(() => {
    //if think this is not used target id is always null

    fetchData();
  }, [params.TreeId]);

  const findElement = (candidateElement, nodeId) => {
    var candidateElementId = candidateElement.id;
    //console.log(candidateElement.elementId);
    // console.log(candidateElementId);
    if (candidateElementId === nodeId) {
      return candidateElement;
    } else {
      for (var i = 0; i < candidateElement.nodes.length; i += 1) {
        var newCandidateElement = candidateElement.nodes[i];
        var result = findElement(newCandidateElement, nodeId);
        if (result != null) {
          return result;
        }
      }
    }
  };

  function updateElementInroot(elementToUpdate, propertyName, propertyValue) {
    let newroot = root;
    let newElement = findElement(newroot[0], elementToUpdate.id);
    newElement[propertyName] = propertyValue;
    setRoot(newroot);
  }

  const changeParent = (source, targetParentId) => {
    console.log("change parent");
    console.log("targetParentId", targetParentId);
    var childObject = findElement(root[0], source.id);
    var currentParent = findElement(root[0], source.parentId);
    currentParent.nodes = currentParent.nodes.filter((item) => item !== childObject);
    var newParentobject = findElement(root[0], targetParentId);
    newParentobject.nodes.push(childObject);
    updateElementInroot(childObject, "parentId", targetParentId);
    setSelectedTreeNode(source);
  };

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  // const menuItems = [
  //   {
  //     text: 'Add new tree item',
  //     onclick: (treeId) => { setSelectedTreeNode(treeId); handleModalOpen(); }
  //   },
  //   {
  //     text: 'Delete',
  //     onclick: (treeId) => { setSelectedTreeNode(treeId); handleDeleteDialogOpen(); }
  //   },
  //   {
  //     text: 'Rename',
  //     onclick: (treeId) => { setSelectedTreeNode(treeId); handleDeleteDialogOpen(); }
  //   }
  // ];

  const openModal = (type) => {
    console.log("openModal);");
    switch (type) {
      case "rename":
        setRenameModalOpen(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        break;
      case "new":
        setNewModalOpen(true);
        break;
      default:
        console.log("Not working!!!");
    }
    console.log("handleModalOpen");
  };

  const handleDeleteDialogOpen = () => {
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setDeleteModalOpen(false);
    setRenameModalOpen(false);
    setNewModalOpen(false);
  };

  const closeAndRefresh = () => {
    fetchData();
    closeModal();
  };

  function GetNode(node) {
    if (node) {
      return (
        <StyledTreeItem
          key={node.id}
          changeParent={changeParent}
          setSelectedTreeNode={setSelectedTreeNode}
          openModal={openModal}
          node={node}
        >
          {node?.nodes?.map((x) => GetNode(x))}
        </StyledTreeItem>
      );
    }
  }

  return (
    <div className="conainer" ref={containerRef}>
      <p>pawsel</p>
      <SimpleTreeView>
        <TreeItem itemId="grid" label="Data Grid">
          <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
          <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
          <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
        </TreeItem>
        <TreeItem itemId="pickers" label="Date and Time Pickers">
          <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
          <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
        </TreeItem>
        <TreeItem itemId="charts" label="Charts">
          <TreeItem itemId="charts-community" label="@mui/x-charts" />
        </TreeItem>
        <TreeItem itemId="tree-view" label="Tree View">
          <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
        </TreeItem>
      </SimpleTreeView>
      treeview:
      <SimpleTreeView
        expanded={expanded}
        // expanded={getNodesIdRoot(root)}///recursive function
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        onNodeToggle={handleToggle}
      >
        {root && root.length > 0 && root.map(x => {
          return <StyledTreeItem key={x.id} node={x} contextmenuid={x.id} nodeId={x.id.toString()}>{GetNode(x.nodes)}</StyledTreeItem>
        })}
        {GetNode(root)}
      </SimpleTreeView>
      {/* <ContextMenu parentRef={containerRef} items={menuItems}></ContextMenu> */}
      <JournalNewModal
        open={newModalOpen}
        selectedTreeNode={selectedTreeNode}
        closeModal={closeModal}
        closeAndRefresh={closeAndRefresh}
      />
      <JournalRenameModal
        open={renameModalOpen}
        selectedJournal={selectedTreeNode}
        closeModal={closeModal}
        closeAndRefresh={closeAndRefresh}
      ></JournalRenameModal>
      <JounralDeleteDialog
        open={deleteModalOpen}
        selectedJournal={selectedTreeNode}
        closeModal={closeModal}
        closeAndRefresh={closeAndRefresh}
      ></JounralDeleteDialog>
    </div>
  );
}
