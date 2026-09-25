import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import EnvironmentOverviewView from '../views/EnvironmentOverviewView.vue'
import BatchLibraryView from '../views/BatchLibraryView.vue'
import TaskBoardView from '../views/TaskBoardView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/environment',
    name: 'environment',
    component: EnvironmentOverviewView,
  },
  {
    path: '/batches',
    name: 'batches',
    component: BatchLibraryView,
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskBoardView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
