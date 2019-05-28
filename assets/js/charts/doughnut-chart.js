(function ($) {
  $(document).on('ready', function () {
    var chart,
      chartClass = '.js-doughnut-chart',
      data = {
        datasets: [{
          data: [45, 15, 15, 30],
          backgroundColor: ['#444bf8', '#2cd2f6', '#00ed96', '#f3f5fb'],
          hoverBackgroundColor: ['#444bf8', '#2cd2f6', '#00ed96', '#f3f5fb'],
          borderWidth: 0
        }],
        labels: ['Blue', 'Light Blue', 'Teal', 'Gray']
      },
      options = {
        responsive: true,
        legend: false,
        tooltips: {
          enabled: false
        },
        cutoutPercentage: 40
      };

    $(chartClass).each(function (i, el) {

      if ($(el).parents().is('.tab-pane')) {

        if ($(el).parents().is('.tab-pane.active')) {

          chart = new Chart(el, {
            type: 'doughnut',
            data: data,
            options: options
          });

          $(el).addClass('initialized');

        }

      } else {

        chart = new Chart(el, {
          type: 'doughnut',
          data: data,
          options: options
        });

        $(el).addClass('initialized');

      }

    });

    if ($('[data-toggle="tab"]').length) {

      $('[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        var $targetEl = $($(e.target).attr('href')).find(chartClass + ':not(.initialized)');

        if ($targetEl.length) {

          chart = new Chart($targetEl, {
            type: 'doughnut',
            data: data,
            options: options
          });

          $targetEl.addClass('initialized');

        }

      });

    }

  });
})(jQuery);