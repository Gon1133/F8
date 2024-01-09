// viết 1 lần sử dụng đc nhiều form

function Validator(options) {

  function getParent(element, selector) {
    while(element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {}

  // hàm main
  function validate(inputElement, rule){
    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
    var errorMessage;
    // lấy ra các rule của selector
    var rules = selectorRules[rule.selector];

    // lặp qua từng rule & và kiểm tra
    // nếu có lỗi thì dừng
    for (var i=0; i<rules.length; i++){
      switch(inputElement.type){
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked')
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value)
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add('invalid')
    }
    else {
      errorElement.innerText = '';
      getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
    }
    // nếu có lỗi sẽ trả về false
    return !errorMessage;
  }
  
  // lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // khi submit form
    formElement.onsubmit = function(e){
      e.preventDefault();

      var isFormValid = true;

      // lặp qua từng rule và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement,rule);
        if (!isValid){
          isFormValid = false;
        }
      });

      
      if (isFormValid) {
        // trường hợp submit với JS
        if (typeof options.onSubmit === 'function'){
          // lấy ra các trường có attribute là name và ko có attribute 'disabled'
          var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
          var formValues = Array.from(enableInputs).reduce(function(values, input){
            
            switch(input.type) {
              case 'radio':
                values[input.name] = formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                break;
              case 'checkbox':
                if (!input.matches(':checked')) {
                  values[input.name] = '';
                  return values;
                } 

                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }

                values[input.name].push(input.value);
                break;
              case 'file':
                values[input.name] = input.files;
                break;

                default:
                  values[input.name] = input.value;
            }
            return values;
          }, {}); 
          options.onSubmit(formValues)
        }
        // Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }

    }

    
    // xử lý lặp qua mỗi rule và xử lý (listener: blur, input,...)
    options.rules.forEach(function (rule) {
      // lưu lại các rule cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])){
        selectorRules[rule.selector].push(rule.test);
      }
      else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);
      
      Array.from(inputElements).forEach(function(inputElement){
        // lắng nghe sự kiện bỏ focus
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        // xử lý khi người dùng nhập
        inputElement.oninput = function() {
          var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
          errorElement.innerText = '';
          getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
      })

    });
  }


}

// Định nghĩa rules
// nguyên tắc của các rules:
// 1. khi có lỗi => trả ra mess lỗi
// 2. khi hợp lệ => ko trả ra cái gì cả (undefined)

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || 'Vui lòng nhập email';
    },
  };
};

Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};

// hàm kiểm tra giá trị nhập theo trường hợp 
Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function(value){
      return value === getConfirmValue() ? undefined : message || 'Giá trị nhập không chính xác'
    }
  }
}