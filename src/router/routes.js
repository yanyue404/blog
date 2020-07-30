
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/List.vue') },
      { path: '/posts/:id', component: () => import('pages/Post.vue') },
      { path: '/:label', component: () => import('pages/List.vue') },
    ],
  },
  {
    path: '/404',
    component: () => import('pages/Error404.vue'),
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
