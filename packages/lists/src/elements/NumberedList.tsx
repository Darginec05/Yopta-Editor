import { RenderElementProps } from 'slate-react';

const NumberedListRender = (props: RenderElementProps) => {
  return (
    <ol data-element-type="NumberedList" {...props.attributes} className="my-4 ml-4 pl-4 [&>li]:mt-2 list-decimal">
      {props.children}
    </ol>
  );
};

export { NumberedListRender };