import FileTree from "./fileTree";

export function createFileTree(input) {
  const fileTree = new FileTree();

  const inputWithId = [];
  const inputWithOutId = [];
  for (const each of input) {
    if (each.parentId) {
      inputWithId.push(each);
    } else {
      inputWithOutId.push(each);
    }
  }
  let sorted = inputWithId.sort((a, b) => a.id - b.id);
  let actualIterable = [...inputWithOutId, ...sorted];

  for (const inputNode of actualIterable) {
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}
