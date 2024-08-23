import React, {
  useState,
  useRef,
  useLayoutEffect,
  cloneElement,
  useEffect,
  Children,
  Component,
} from "react";
import {createPortal} from "react-dom";

export const Conditional = (props) => {
  const {_key, active, children} = props;
  const [targetElement, setTargetElement] = useState(
    document.createElement("div")
  );
  const [createPortalState, setCreatePortalState] = useState(null);
  const [Instantiate, setInstantiate] = useState(null);
  const containerRef = useRef();
  useLayoutEffect(() => {
    if (_key===undefined ) {
      throw new Error("The key of the KeepAlive child component is required");
    }

    if (active && !createPortalState) {
        let refProps ={};
        if(children?.type?.prototype?.render){
            refProps={
                ref: (ref) => {
                  setInstantiate(ref);
                }
            };
        }else{
            refProps={};
            console.warn('%c If the child component of KeepAlive is a function component, the activated and deactivated hook functions are not supported', 'color: rgb(179, 153, 51); font-size: 16px');
        }
      setCreatePortalState(
        createPortal(
          cloneElement(
            children,
            refProps
        ),
          targetElement
        )
      );
    }
  }, [_key, active, createPortalState]);
   useEffect(() => {
    if(Instantiate){
        if (active) {
            Instantiate.activated();
          }else{
            Instantiate.deactivated();
        }
    }
    if (active) {
      containerRef.current.appendChild(targetElement);
    } else {
      try {
        containerRef.current.removeChild(targetElement);
      } catch (e) {
        // console.error(e);
      }
    }
  }, [active]);
  return (
    <>
      <div ref={containerRef} />
      {createPortalState}
    </>
  );
};

const KeepAlive = (props) => {
  const {activeKey, children} = props;
  return Children.map(children, (child,index) => {
   const {key}= child;
    return   <Conditional _key={key}  active={key==activeKey}>{
        child}</Conditional>;
  });
};

export default KeepAlive;
