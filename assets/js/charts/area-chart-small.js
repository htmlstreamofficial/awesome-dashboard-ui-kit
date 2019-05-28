(function ($) {
  $(document).on('ready', function () {

    var chart,
      chartClass = '.js-area-chart-small',
      data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          backgroundColor: 'transparent'
        }]
      },
      options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        elements: {
          line: {
            borderWidth: 2
          },
          point: {
            radius: 0
          }
        },
        layout: {
          padding: {
            top: 1,
            bottom: 1
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
              drawTicks: false
            },
            ticks: {
              display: false,
              padding: 0
            }
          }],
          yAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
              drawTicks: false
            },
            ticks: {
              min: 0,
              max: 100,
              display: false,
              padding: 0
            }
          }]
        }
      };

    $(chartClass).each(function (i, el) {

      var extendedData = JSON.parse(el.getAttribute('data-extend'));

      for(var ii = 0; ii < data.datasets.length; ii++) {
        data.datasets[ii].data = extendedData[ii].data;
        data.datasets[ii].borderColor = extendedData[ii].borderColor;
      }

      if($(el).parents().is('.tab-pane')) {

        if($(el).parents().is('.tab-pane.active')) {

          chart = new Chart(el, {
            type: 'line',
            data: data,
            options: options
          });

          $(el).addClass('initialized');

        }

      } else {

        chart = new Chart(el, {
          type: 'line',
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
            type: 'line',
            data: data,
            options: options
          });

          $targetEl.addClass('initialized');

        }

      });

    }

  });
})(jQuery);