/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {ReactElement} from 'react';

interface IClickWrapperProps {
    children: ReactElement | ReactElement[];
    onClickFunc: any;
}
function ClickWrapper(props: IClickWrapperProps) {
    const {children, onClickFunc} = props;

    return (
        <React.Fragment>
            {React.Children.map(children, child => {
                if (child) {
                    return React.cloneElement(child, {
                        //@ts-ignore
                        onClick: onClickFunc,
                    });
                }
            })}
        </React.Fragment>
    );
}

export default ClickWrapper;
