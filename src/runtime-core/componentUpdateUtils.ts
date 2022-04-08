export function shouldUpdateComponent(prevVNode, nextVNode) {
  const { props: nextProps } = nextVNode;
  const { props: prevProps } = prevVNode;
  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
