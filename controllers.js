angular.module('toolRentalApp').controller('MainController', function(ToolService) {
  let vm = this;

  vm.tools = [];
  vm.categories = {};
  vm.currentCategory = null;
  vm.filteredTools = [];
  vm.brandFilter = '';
  vm.priceFilter = 2000;
  vm.inStockOnly = false;
  vm.selectedTool = null;

  // Инициализация
  ToolService.getTools().then((tools) => {
    vm.tools = tools;
    applyFilters();
  });

  ToolService.getCategories().then((categories) => {
    vm.categories = categories;
  });

  // Методы
  vm.setCategory = function(category) {
    vm.currentCategory = category;
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
    vm.showNotification('Аренда оформлена! Номер заказа: #' + Math.floor(Math.random() * 1000));

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
});
