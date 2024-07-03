import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Administrator'
  },
  {
    name: 'User',
    url: '/admin/user',
    iconComponent: { name: 'cil-drop' },
  },
  {
    name: 'Role',
    url: '/admin/role',
    iconComponent: { name: 'cil-drop' },
    children: [
      {
        name: 'Role Data',
        url: '/admin/role/data'
      },
      {
        name: 'Akses Role',
        url: '/admin/role/akses'
      }
    ]
  },
  {
    name: 'Unit',
    url: '/admin/unit',
    iconComponent: { name: 'cil-drop' },
    children: [
      {
        name: 'Unit Data',
        url: '/admin/unit/data'
      },
      {
        name: 'Group Unit',
        url: '/admin/unit/group'
      }
    ]
  },
  {
    title: true,
    name: 'General Service'
  },
  {
    name: 'Items',
    url: '/gs/barang',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Setting Cabang',
    url: '/gs/cabang',
    iconComponent: { name: 'cil-drop' },
    children: [
      {
        name: 'Setting Per Cabang',
        url: '/gs/cabang/per'
      },
      {
        name: 'Setting Semua Cabang',
        url: '/gs/cabang/semua'
      }
    ]
  },
  {
    name: 'Approval Pengajuan',
    url: '/gs/approval',
    iconComponent: { name: 'cil-drop' }
  },
  {
    title: true,
    name: 'PIC Gudang'
  },
  {
    name: 'Stok Item',
    url: '/picg/stok',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Approval Pengajuan',
    url: '/picg/approve-pengajuan',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Input Item Masuk',
    url: '/picg/input-item',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Balancing',
    url: '/picg/balancing',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Pengajuan GS',
    url: '/picg/pengajuan-gs',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'History',
    url: '/picg/history',
    iconComponent: { name: 'cil-drop' }
  },
  {
    title: true,
    name: 'BOH'
  },
  {
    name: 'Approval',
    url: '/boh/approval',
    iconComponent: { name: 'cil-drop' },
    children: [
      {
        name: 'Approval Balancing',
        url: '/boh/approval/balancing'
      },
      {
        name: 'Approval Stok Item',
        url: '/boh/approval/stok'
      },
      {
        name: 'Approval Pengajuan GS',
        url: '/boh/approval/gs'
      }
    ]
  },
  {
    name: 'History',
    url: '/boh/history',
    iconComponent: { name: 'cil-drop' },
    children: [
      {
        name: 'History Balancing',
        url: '/boh/history/balancing'
      },
    ]
  },
  {
    name: 'Revisi',
    url: '/boh/revisi',
    iconComponent: { name: 'cil-drop' }
  },
  {
    title: true,
    name: 'Pemohon'
  },
  {
    name: 'Pengajuan',
    url: '/pemohon/pengajuan',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Approval Terima Barang',
    url: '/pemohon/approval-barang',
    iconComponent: { name: 'cil-drop' }
  },

];
