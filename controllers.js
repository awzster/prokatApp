angular.module('toolRentalApp').controller('MainController', function(ToolService, SharedService) {
  let vm = this;

  vm.tools = [];
  vm.categories = {};
  vm.currentCategory = null;
  vm.filteredTools = [];
  vm.brandFilter = '';
  vm.priceFilter = 2000;
  vm.inStockOnly = false;
  vm.selectedTool = null;

  vm.shared = SharedService;


  // Показываем популярные инструменты на главной
  ToolService.getTools().then(function(tools) {
    vm.featuredTools = tools.slice(0, 6); // Первые 6 инструментов
  });
    
  ToolService.getCategories().then((categories) => {
    vm.categories = categories;
  });

  // Методы
  vm.setCategory = function(category) {
    vm.currentCategory = category;
    window.location.hash = category ? `#/category/${ category}` : '#/';
    applyFilters();
  };

  vm.countToolsInCategory = function(category) {
    return vm.tools.filter((tool) => {
      return tool.category === category;
    }).length;
  };

  vm.getBrands = function() {
    let brands = [];
    vm.tools.forEach((tool) => {
      if (tool.category === vm.currentCategory && brands.indexOf(tool.brand) === -1) {
        brands.push(tool.brand);
      }
    });
    return brands;
  };

  vm.showDetails = function(tool) {
    vm.selectedTool = tool;
    $('#toolDetailsModal').modal('show');
  };

  function applyFilters() {
    vm.filteredTools = vm.tools.filter((tool) => {
      // Фильтр по категории
      if (vm.currentCategory && tool.category !== vm.currentCategory) {
        return false;
      }

      // Фильтр по бренду
      if (vm.brandFilter && tool.brand !== vm.brandFilter) {
        return false;
      }

      // Фильтр по цене
      if (tool.price_per_day > vm.priceFilter) {
        return false;
      }

      // Фильтр по наличию
      if (vm.inStockOnly && !tool.in_stock) {
        return false;
      }

      return true;
    });
  }

  vm.cart = []; // Добавляем корзину

  // ... остальной существующий код ...

  // Методы для корзины
  vm.addToCart = function(tool) {
    vm.cart.push(tool);
  };

  vm.showCart = function() {
    // Здесь можно открыть модальное окно с корзиной
    alert(`В корзине ${ vm.cart.length } инструментов`);
  };

  vm.rentalData = {
    name: '',
    phone: '',
    email: '',
    date: new Date(),
    days: 1,
    address: ''
  };

  vm.validatePhone = function() {
    const phoneRegex = /^\+?[0-9\s\-\(\)]{10,15}$/;
    return phoneRegex.test(vm.rentalData.phone);
  };

  vm.calculateTotal = function() {
    if (!vm.rentalTool) return 0;
    return vm.rentalTool.price_per_day * vm.rentalData.days;
  };

  vm.rentalTool = null;

  vm.openRentalModal = function(tool) {
    vm.rentalTool = tool;
    $('#rentModal').modal('show');
  };

  // Метод для подтверждения аренды

  vm.submitRental = function() {
    if (!vm.validatePhone() || !vm.rentalData.address) {
      alert('Пожалуйста, заполните все обязательные поля корректно');
      return;
    }

    const rental = {
      tool: vm.rentalTool,
      customer: vm.rentalData,
      total: vm.calculateTotal(),
      date: new Date()
    };

    vm.cart.push(rental);

    // Покажем уведомление
    vm.showNotification(`Аренда оформлена! Номер заказа: #${ Math.floor(Math.random() * 1000)}`);

    $('#rentModal').modal('hide');
  };

  vm.showNotification = function(message) {
    const notification = angular.element('<div class="alert alert-success notification"></div>');
    notification.text(message);
    angular.element(document.body).append(notification);

    setTimeout(() => {
      notification.fadeOut(() => notification.remove());
    }, 3000);
  };


  vm.applyFilters = applyFilters;
})
  .controller('ContactsController', function($sce, SharedService) {
    let vm = this;

    vm.shared = SharedService;

    vm.contactInfo = {
      address: 'г. Москва, ул. Строителей, 42, офис 15',
      phone: '8 (800) 123-45-67',
      email: 'info@renttools.ru',
      workingHours: 'Пн-Пт: 9:00 - 20:00<br>Сб-Вс: 10:00 - 18:00'
    };

    /* 
    vm.trustedMapUrl = $sce.trustAsResourceUrl(
      'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A6f1d9a9338df8c00cb047ac31a80b7c7379c146f771bbce21ee6004e3009d8d1&amp;width=757&amp;height=653&amp;lang=ru_RU&amp;scroll=true' 
    );
    */

    vm.messengers = [
      { name: 'Telegram', icon: 'send', link: 'https://t.me/renttools', class: 'telegram' },
      { name: 'Viber', icon: 'phone', link: 'viber://chat?number=88001234567', class: 'viber' },
      { name: 'WhatsApp', icon: 'ok', link: 'https://wa.me/88001234567', class: 'whatsapp' }
    ];
  })

.controller('CategoryController', ['$routeParams', 'ToolService', 'SharedService',
  function($routeParams, ToolService, SharedService) {
    var vm = this;
    vm.categoryId = $routeParams.categoryId;
    vm.shared = SharedService;
    
    ToolService.getTools().then(function(tools) {
      vm.tools = tools.filter(function(tool) {
        return tool.category === vm.categoryId;
      });
    });
    
    vm.getCategoryName = function() {
      return vm.shared.categories[vm.categoryId]?.name || 'Категория';
    };
  }
])

// Контроллер для страницы продукта
.controller('ProductController', ['$routeParams', 'ToolService', 'SharedService',
  function($routeParams, ToolService, SharedService) {
    var vm = this;
    vm.productId = $routeParams.productId;

    vm.shared = SharedService;
    
    ToolService.getTools().then(function(tools) {
      vm.product = tools.find(function(tool) {
        return tool.id == vm.productId;
      });
      
      if (!vm.product) {
        vm.notFound = true;
      }
    });

  vm.getSpecName = function(key) {
    // Простая замена ключей на читаемые названия
    let specNames = {
      voltage: 'Напряжение',
      battery_type: 'Тип аккумулятора',
      battery_capacity: 'Ёмкость аккумулятора',
      torque_nm: 'Крутящий момент (Нм)',
      no_load_speed: 'Скорость вращения (хол. ход)',
      air_consumption: 'Расход воздуха',
      air_pressure: 'Давление воздуха',
      drive_size: 'Размер привода',
      max_speed: 'Макс. скорость',
      spindle_speed: 'Скорость шпинделя',
      disc_diameter: 'Диаметр диска',
      engine_volume: 'Объём двигателя',
      power: 'Мощность',
      fuel_tank: 'Объём бака',
      chain_pitch: 'Шаг цепи',
      bar_length: 'Длина шины',
      chain_speed: 'Скорость цепи',
      pieces: 'Количество предметов',
      material: 'Материал',
      storage_case: 'Кейс для хранения',
      warranty_years: 'Гарантия (лет)',
      coating: 'Покрытие'
    };

    return specNames[key] || key;
  };


    
    vm.openRentalModal = function() {
      $('#rentModal').modal('show');
      // Логика открытия модального окна аренды
    };
  }
])
  .factory('SharedService', (ToolService) => {
    let service = {
      categories: {},
      cart: [],
      contactInfo: {
        address: 'Боровлянский с/с, пос. Опытный, ул. Строителей, д.3 кв.1',
        phone: '+375(25)928-2291',
        email: 'info@prokatlux.by',
        workingHours: 'Пн-Пт: 9:00 - 20:00 | Сб-Вс: 10:00 - 18:00'
      },

      messengers: [
        { name: 'Telegram', icon: 'send', link: 'https://t.me/renttools', class: 'telegram', faIcon: 'fa fa-telegram' },
        { name: 'Viber', icon: 'phone', link: 'viber://chat?number=+375(25)9282291', class: 'viber', faIcon: 'fa fa-viber' },
        { name: 'WhatsApp', icon: 'ok', link: 'https://wa.me/+375(25)9282291', class: 'whatsapp', faIcon: 'fa fa-whatsapp' }
      ],
    };

    // Загружаем категории
    ToolService.getCategories().then((data) => {
      service.categories = data;
    });

    return service;
  })
  .controller('HeaderController', function($location, SharedService) {
    let vm = this;
    vm.shared = SharedService;

    this.isNavCollapsed = true;
    vm.route = (path) =>
    {
      $location.path(path);
      this.isNavCollapsed = !this.isNavCollapsed;
    };

    vm.routeCategoty = (cat) =>
    {
      window.console.log(cat);
      $location.path(`/category/${cat}`);
      this.isNavCollapsed = !this.isNavCollapsed;
    };

    vm.getCategories = function() {
      return SharedService.categories;
    };
  })
;

