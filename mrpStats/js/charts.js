var data;
var ajax = new XMLHttpRequest();
ajax.open('GET', 'activity.json');
ajax.addEventListener('readystatechange', function(event) {
  if(this.readyState == 4 && this.status == 200) {
    data = JSON.parse(this.responseText);
    var _group, _type;
    document.addEventListener('DOMContentLoaded', function() {
      var choice = $('#choice');
      var button = $('#btn');
      var _group, _type;
      button.addEventListener('click', function(event) {
        event.preventDefault();
        Array.from(choice.querySelectorAll('input[name=group]'), function(item) {
          if(item.checked) {
            _group = item.value;
          }
        });
        Array.from(choice.querySelectorAll('input[name=type]'), function(item) {
          if(item.checked) {
            _type = item.value;
          }
        });
        var config = {};
        config[_group] = {};
        config[_group][_type] = [];
        for(var group in config) {
          for(var type in config[group]) {
            for(var nick in data[group]) {
              var series = {
                name: nick,
                data: []
              };
              for(var date in data[group][nick]) {
                var ds = date.split('-');
                series.data.push({x: Date.UTC(ds[2], ds[1]-1, ds[0]), y: data[group][nick][date][type]});
              }
              config[group][type].push(series);
            }
            console.log(config[group][type]);
          }
        }
        createChart(_group, _type,  config[_group][_type]);
      });
    });

  }
});
ajax.send();



function createChart(group, type, series) {
  console.log('chart');
  series.forEach(function(name){
    name.data.sort(function (a,b) {
      if(a.x < b.x) {
        return -1;
      } else if (a.x > b.x) {
        return 1;
      }
      return 0;
    });
  });
  console.log(series);
  var x = new Highcharts.chart('chart'/*group+'-'+type*/, {
    chart: {
      type: 'spline'
    },
    title: {
      text: group+'-'+type,
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
          month: '%e. %b',
      },
      title: {
          text: 'Data'
      }
    },
    yAxis: {
      title: {
        text: 'Ilośc logów'
      },
      min: 0
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      headerFormat: '<b>{point.x:%e. %b}</b><br>',
      pointFormat: '<b>{series.name}:</b>: {point.y:f} logów<br>'
    },
    plotOptions: {
      spline: {
          marker: {
              enabled: true
          }
      }
    },
    series: series
  });
  return x;
}


function $(e, _=document) {
  var x = _.querySelectorAll(e);
  if(x.length==1) {
    return x[0];
  }
  return x;
}
