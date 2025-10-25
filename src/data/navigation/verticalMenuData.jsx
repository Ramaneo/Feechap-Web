const verticalMenuData = dictionary => [
  // Dashboard
  {
    label: dictionary['navigation'].dashboards,
    icon: 'tabler-smart-home',
    href: '/dashboard'
  },

  // Calculate (محاسبه هزینه چاپ)
  {
    label: dictionary['navigation'].calculate,
    icon: 'tabler-calculator',
    children: [
      {
        label: dictionary['navigation'].calculateOffsetSefareshi,
        icon: 'tabler-printer',
        children: [
          {
            label: dictionary['navigation'].calculateTakBargi,
            icon: 'tabler-file',
            href: '/calculate/offset-sefareshi/tak-bargi'
          },
          {
            label: dictionary['navigation'].calculateChandBargi,
            icon: 'tabler-files',
            href: '/calculate/offset-sefareshi/chand-bargi',
            disabled: true
          },
          {
            label: dictionary['navigation'].calculateGhalebPishfarz,
            icon: 'tabler-template',
            href: '/calculate/offset-sefareshi/presets'
          }
        ]
      },
      {
        label: dictionary['navigation'].calculateGraphic,
        icon: 'tabler-palette',
        href: '/calculate/graphic',
        disabled: true
      },
      {
        label: dictionary['navigation'].calculateDigital,
        icon: 'tabler-device-desktop',
        href: '/calculate/digital',
        disabled: true
      },
      {
        label: dictionary['navigation'].calculatePublisher,
        icon: 'tabler-book',
        href: '/calculate/publisher',
        disabled: true
      },
      {
        label: dictionary['navigation'].calculateOffsetAmade,
        icon: 'tabler-forms',
        href: '/calculate/offset-amade',
        disabled: true
      }
    ]
  },

  // Price Tables (جدول قیمت‌ها)
  {
    label: dictionary['navigation'].priceTables,
    icon: 'tabler-currency-dollar',
    children: [
      {
        label: dictionary['navigation'].calculateOffsetSefareshi,
        children: [
          {
            label: dictionary['navigation'].pricesPaper,
            icon: 'tabler-file-text',
            href: '/prices/papers'
          },
          {
            label: dictionary['navigation'].pricesLitography,
            icon: 'tabler-photo',
            href: '/prices/lithographies'
          },
          {
            label: dictionary['navigation'].pricesNezarat,
            icon: 'tabler-eye',
            href: '/prices/monitorings'
          },
          {
            label: dictionary['navigation'].pricesOffset,
            children: [
              {
                label: dictionary['navigation'].pricesOffsetMachine,
                icon: 'tabler-printer',
                href: '/prices/colors'
              },
              {
                label: dictionary['navigation'].pricesOffsetTiraj,
                icon: 'tabler-copy',
                href: '/prices/circulations'
              }
            ]
          },
          {
            label: dictionary['navigation'].pricesCovers,
            children: [
              {
                label: dictionary['navigation'].pricesUv,
                icon: 'tabler-sun',
                href: '/prices/uvs'
              },
              {
                label: dictionary['navigation'].pricesSelefon,
                icon: 'tabler-circle-dashed',
                href: '/prices/selefons'
              },
              {
                label: dictionary['navigation'].pricesLaminate,
                icon: 'tabler-layers-intersect',
                href: '/prices/laminates'
              }
            ]
          },
          {
            label: dictionary['navigation'].pricesBox,
            children: [
              {
                label: dictionary['navigation'].pricesBoxes,
                icon: 'tabler-box',
                href: '/prices/boxes'
              },
              {
                label: dictionary['navigation'].pricesBoxPack,
                icon: 'tabler-package',
                href: '/prices/pockets'
              },
              {
                label: dictionary['navigation'].pricesBoxSack,
                icon: 'tabler-shopping-bag',
                href: '/prices/bags'
              }
            ]
          },
          {
            label: dictionary['navigation'].pricesSahafi,
            icon: 'tabler-book-2',
            href: '/prices/binderies'
          },
          {
            label: dictionary['navigation'].pricesTakmili,
            children: [
              {
                label: dictionary['navigation'].pricesTakmiliGhalebsazi,
                icon: 'tabler-layout-grid',
                href: '/prices/framings'
              },
              {
                label: dictionary['navigation'].pricesTakmiliKelishesazi,
                icon: 'tabler-stamp',
                href: '/prices/plates'
              },
              {
                label: dictionary['navigation'].pricesTakmiliTalakoob,
                icon: 'tabler-sparkles',
                href: '/prices/golds'
              },
              {
                label: dictionary['navigation'].pricesTakmiliLetterpress,
                icon: 'tabler-typography',
                href: '/prices/letterpress'
              },
              {
                label: dictionary['navigation'].pricesTakmiliBoresh,
                icon: 'tabler-cut',
                href: '/prices/cuts'
              },
              {
                label: dictionary['navigation'].pricesTakmiliSarchasb,
                icon: 'tabler-droplet',
                href: '/prices/glues'
              },
              {
                label: dictionary['navigation'].pricesTakmiliShomarezani,
                icon: 'tabler-numbers',
                href: '/prices/numerations'
              },
              {
                label: dictionary['navigation'].pricesTakmiliPerferazh,
                icon: 'tabler-dots',
                href: '/prices/perforages'
              }
            ]
          },
          {
            label: dictionary['navigation'].pricesOthers,
            icon: 'tabler-dots-vertical',
            href: '/prices/others'
          }
        ]
      },
      {
        label: dictionary['navigation'].calculateGraphic,
        icon: 'tabler-palette',
        href: '/prices/graphic',
        disabled: true
      },
      {
        label: dictionary['navigation'].calculateDigital,
        icon: 'tabler-device-desktop',
        href: '/prices/digital',
        disabled: true
      },
      {
        label: dictionary['navigation'].calculatePublisher,
        icon: 'tabler-book',
        href: '/prices/publisher',
        disabled: true
      },
      {
        label: dictionary['navigation'].calculateOffsetAmade,
        icon: 'tabler-forms',
        href: '/prices/offset-amade',
        disabled: true
      }
    ]
  },

  // Management Coworkers (مدیریت همکاران)
  {
    label: dictionary['navigation'].managementCoworkers,
    icon: 'tabler-users',
    children: [
      {
        label: dictionary['navigation'].coworkersList,
        icon: 'tabler-user-circle',
        href: '/coworkers/list'
      }
    ]
  },

  // Management Customers (مدیریت مشتریان)
  {
    label: dictionary['navigation'].managementCustomers,
    icon: 'tabler-user-heart',
    children: [
      {
        label: dictionary['navigation'].customersList,
        icon: 'tabler-list',
        href: '/customers/list'
      },
      {
        label: dictionary['navigation'].customersOrders,
        icon: 'tabler-shopping-cart',
        href: '/customers/orders'
      }
    ]
  },

  // Settings (تنظیمات)
  {
    label: dictionary['navigation'].settings,
    icon: 'tabler-settings',
    children: [
      {
        label: dictionary['navigation'].settingsPrices,
        icon: 'tabler-coin',
        href: '/settings/prices'
      },
      {
        label: dictionary['navigation'].settingsFactor,
        icon: 'tabler-file-invoice',
        href: '/settings/factor'
      }
    ]
  },

  // Admin Section (for admin users)
  {
    label: dictionary['navigation'].adminSection,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].packages,
        icon: 'tabler-package',
        children: [
          {
            label: dictionary['navigation'].packagesBundles,
            icon: 'tabler-packages',
            href: '/packages/bundles'
          },
          {
            label: dictionary['navigation'].packagesModules,
            icon: 'tabler-components',
            href: '/packages/modules'
          },
          {
            label: dictionary['navigation'].packagesDiscounts,
            icon: 'tabler-discount',
            href: '/packages/discounts'
          }
        ]
      },
      {
        label: dictionary['navigation'].settingsFormulas,
        icon: 'tabler-math',
        href: '/settings/formulas'
      },
      {
        label: dictionary['navigation'].settingsUsers,
        icon: 'tabler-users-group',
        href: '/users'
      },
      {
        label: dictionary['navigation'].settingsFormats,
        icon: 'tabler-dimensions',
        href: '/settings/formats'
      }
    ]
  }
]

export default verticalMenuData
