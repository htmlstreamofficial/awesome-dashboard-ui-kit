(function ($) {
  $(document).on('ready', function () {

    var chart,
      chartClass = '.js-area-chart',
      data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          data: [10000, 9200, 10800, 10400, 12800, 13200, 15200, 14800, 15600],

          borderColor: 'rgba(0, 237, 150, 1)',
          backgroundColor: 'rgba(0, 237, 150, .1)',

          pointBackgroundColor: "#ffffff",
          pointShadowColor: 'rgba(0, 0, 0, .19)',
          pointShadowOffsetX: 0,
          pointShadowOffsetY: 2
        }, {
          data: [4000, 3200, 4800, 4400, 6800, 7200, 9200, 8800, 9600],

          borderColor: 'rgba(68, 75, 248, 1)',
          backgroundColor: 'rgba(68, 75, 248, .1)',

          pointBackgroundColor: "#ffffff",
          pointShadowColor: 'rgba(0, 0, 0, .19)',
          pointShadowOffsetX: 0,
          pointShadowOffsetY: 2
        }]
      },
      options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        hover: {
          mode: 'nearest',
          intersect: false
        },
        tooltips: {
          enabled: false,
          mode: 'nearest',
          intersect: false,
          custom: function (tooltipModel) {
            // Tooltip Element
            var tooltipEl = document.getElementById('chartjsAreaTooltip');

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjsAreaTooltip';
              tooltipEl.classList.add('u-chartjs-tooltip-wrap');
              tooltipEl.innerHTML = '<div class="u-chartjs-tooltip"></div>';
              document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
              return bodyItem.lines;
            }

            // Set Text
            if (tooltipModel.body) {
              var titleLines = tooltipModel.title || [],
                bodyLines = tooltipModel.body.map(getBody),
                today = new Date();

              var innerHtml = '<header class="u-chartjs-tooltip-header">';

              titleLines.forEach(function (title) {
                innerHtml += title + ', ' + today.getFullYear();
              });

              innerHtml += '</header><div class="u-chartjs-tooltip-body">';

              bodyLines.forEach(function (body, i) {
                var oldBody = body[0],
                  newBody = oldBody.substring(0, oldBody.length - 3) + ',' + oldBody.substring(oldBody.length - 3);

                innerHtml += '$' + (oldBody.length > 3 ? newBody : body);
              });

              innerHtml += '</div>';

              var tooltipRoot = tooltipEl.querySelector('.u-chartjs-tooltip');
              tooltipRoot.innerHTML = innerHtml;
            }

            // `this` will be the overall tooltip
            var position = this._chart.canvas.getBoundingClientRect();

            // Display, position, and set styles for font
            console.log();

            tooltipEl.style.opacity = 1;
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - (tooltipEl.offsetWidth / 2) - 3 + 'px';
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - tooltipEl.offsetHeight - 25 + 'px';
            tooltipEl.style.pointerEvents = 'none';
          }
        },
        elements: {
          line: {
            borderWidth: 3
          },
          point: {
            pointStyle: 'circle',
            radius: 5,
            hoverRadius: 7,
            borderWidth: 3,
            backgroundColor: '#ffffff'
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              fontWeight: 400,
              fontSize: 14,
              fontFamily: 'Roboto, sans-serif',
              fontColor: '#999BA8'
            }
          }],
          yAxes: [{
            gridLines: {
              borderDash: [8, 8],
              color: '#eaf2f9',
              drawBorder: false,
              drawTicks: false,
              zeroLineColor: 'transparent'
            },
            ticks: {
              min: 0,
              max: 20000,
              display: false,
              padding: 0
            }
          }]
        }
      };

    $(chartClass).each(function (i, el) {

      if ($(el).parents().is('.tab-pane')) {

        if ($(el).parents().is('.tab-pane.active')) {

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