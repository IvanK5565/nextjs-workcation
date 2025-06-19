/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {JSX} from 'react';

import {IconContext, DefaultContext} from './iconContext';

export interface IconTree {
    tag: string;
    attr: {[key: string]: string};
    child: IconTree[];
}


function camelCaseAttributes(attr: {[key: string]: string} = {}) {
    const newAttr: {[key: string]: string} = {};
    Object.keys(attr).forEach((key) => {
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        newAttr[camelKey] = attr[key];
    });
    return newAttr;
}

function Tree2Element(tree: IconTree[] = []): React.ReactElement<object>[] {
    return tree.map((node, i) => {
        const safeAttr = node.attr || {};
        return React.createElement(
            node.tag,
            { key: i, ...camelCaseAttributes(safeAttr) },
            Tree2Element(node.child),
        );
    });
}

// export function GenIcon(data: IconTree) {
//     return (props: IconBaseProps) => {
//         return <IconBase attr={{ ...data.attr }} {...props}>
//             {Tree2Element(data.child)}
//         </IconBase>;
//     };
// }
export function GenIcon(data: IconTree) {
    const IconComponent = (props: IconBaseProps) => {
        return (
            //@ts-ignore
            <IconBase attr={{...data.attr}} {...props}>
                {Tree2Element(data.child)}
            </IconBase>
        );
    };
    IconComponent.displayName = `GenIcon(${data.attr.title || 'Icon'})`;

    return IconComponent;
}

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    children: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
}

export type IconType = (props: IconBaseProps) => JSX.Element;
export function IconBase(
    props: IconBaseProps & {
        attr: object | undefined;
        size: '1em';
        color: '';
        title: '';
    },
): JSX.Element {
    const elem = (conf: IconContext) => {
        const computedSize = props.size || conf.size || '1em';
        let className;
        if (conf.className) {
            className = conf.className;
        }
        if (props.className) {
            className = (className ? `${className} ` : '') + props.className;
        }
        const {attr, title, ...svgProps} = props;
        return (
            <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                {...conf.attr}
                {...attr}
                {...svgProps}
                className={className}
                style={{
                    color: props.color || conf.color,
                    ...conf.style,
                    ...props.style,
                }}
                height={computedSize}
                width={computedSize}
                xmlns="http://www.w3.org/2000/svg">
                {title && <title>{title}</title>}
                {props.children}
            </svg>
        );
    };
    return IconContext !== undefined ? (
        <IconContext.Consumer>
            {(conf: IconContext) => elem(conf)}
        </IconContext.Consumer>
    ) : (
        elem(DefaultContext)
    );
}
