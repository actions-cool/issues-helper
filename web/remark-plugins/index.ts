import { unistUtilVisit } from 'dumi';

const WRAPPER_OPEN_TAG = '<wrapper';
const WRAPPER_CLOSE_TAG = '</wrapper>';

function remarkPlugin(opt) {
  return (tree, vFile) => {
    unistUtilVisit.visit(tree, 'html', (node, index, parent) => {
      if (node.value.startsWith(WRAPPER_OPEN_TAG)) {
        // get attributes
        const attrMatch = node.value.match(/(\w+)=['"]([^'"]+)['"]/g);

        // convert attributes to object
        const attrObj = attrMatch.reduce((acc, cur) => {
          const split = cur.split('=');
          const key = split[0].trim().replace(/['"]/g, '');
          const value = split[1].trim().replace(/['"]/g, '');

          if (value.match(/^-?\d+$/)) {
            acc[key] = Number(value);
          } else {
            acc[key] = value;
          }

          return acc;
        }, {});

        // transform headings
        const depth = Number.isInteger(attrObj['depth']) ? attrObj['depth'] : 0;
        unistUtilVisit.visit(tree, 'heading', (node: any) => {
          node.depth = node.depth - depth;
        });

        // transform links
        unistUtilVisit.visit(tree, 'link', (node, index, parent) => {
          /**
           * remove blacktop link
           * zh-CN: url="#列-表", en-US: url="#List"
           */
          if (['#列-表', '#List'].includes(node.url)) {
            if (parent && typeof index === 'number') {
              parent.children.splice(
                index,
                1,
                // ...('children' in node ? node.children : []) // 不需要保留子节点
              )
            };
            return unistUtilVisit.CONTINUE;
          }

          /**
           * redirect:
           * 1. token 说明
           */
          if (node.url === '#token') {
            node.url = `./guide/ref${node.url}`
            return unistUtilVisit.CONTINUE;
          }

          if (['#emoji-类型', '#emoji-types'].includes(node.url)) {
            node.url = `./guide/ref${node.url}`
            return unistUtilVisit.CONTINUE;
          }

          if (node.url === '#github-docs') {
            node.url = `./guide/ref${node.url}`
            return unistUtilVisit.CONTINUE;
          }

          if (['#outputs-使用', '#outputs-use'].includes(node.url)) {
            node.url = `./guide/ref${node.url}`
            return unistUtilVisit.CONTINUE;
          }

          if (['#校验规则', '#check-rules'].includes(node.url)) {
            node.url = `./guide/ref${node.url}`
            return unistUtilVisit.CONTINUE;
          }

          if (node.url === '#comment-id') {
            node.url = `./guide/ref${node.url}`
            return unistUtilVisit.CONTINUE;
          }
        });
      };

      if (
        (node.value === WRAPPER_CLOSE_TAG || node.value.startsWith(WRAPPER_OPEN_TAG)) &&
        parent &&
        typeof index === 'number'
      ) {
        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1)
        };
      }
    });
  };
}

export default remarkPlugin;