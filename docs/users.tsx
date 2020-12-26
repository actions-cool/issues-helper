/* eslint-disable react/jsx-no-target-blank */

import React from 'react';

const USERS = [
  {
    name: 'ant-design',
    link: 'https://github.com/ant-design/ant-design',
    logo: 'https://avatars1.githubusercontent.com/u/12101536?s=200&v=4',
  },
  {
    name: 'ant-design-vue',
    link: 'https://github.com/vueComponent/ant-design-vue',
    logo: 'https://avatars2.githubusercontent.com/u/32120805?s=200&v=4',
  },
  {
    name: 'dumi',
    link: 'https://github.com/umijs/dumi',
    logo: 'https://avatars2.githubusercontent.com/u/33895495?s=200&v=4',
  },
  {
    name: 'umi',
    link: 'https://github.com/umijs/umi',
    logo: 'https://avatars2.githubusercontent.com/u/33895495?s=200&v=4',
  },
  {
    name: 'vue-request',
    link: 'https://github.com/AttoJS/vue-request',
    logo: 'https://raw.githubusercontent.com/AttoJS/art/master/vue-request-logo.png',
  }
];

export default () => {
  return (
    <ul style={{ display: 'flex', flexWrap: 'wrap', margin: 0, padding: 0, listStyle: 'none' }}>
      {USERS.map((user, i) => (
        <li
          key={user.link}
          style={{
            width: 220,
            marginRight: i === USERS.length - 1 ? 0 : 16,
            marginBottom: 8,
            border: '1px solid #eee',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 600,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <a
            style={{ display: 'block', color: '#666', padding: '18px', textDecoration: 'none' }}
            target="_blank"
            href={user.link}
          >
            <img
              width={(user.name && 40) || undefined}
              height={(!user.name && 40) || undefined}
              style={{ verticalAlign: '-0.32em' }}
              src={user.logo}
              alt={user.name}
            />
            <div>{user.name}</div>
          </a>
        </li>
      ))}
    </ul>
  );
};
