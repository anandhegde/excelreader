/* ------------------------------------------------------------------------------
*
*  # Timelines
*
*  Specific JS code additions for Timeline pages set
*
*  Version: 1.0
*  Latest update: Aug 1, 2015
*
* ---------------------------------------------------------------------------- */

$(function() {


    // Charts
    // ------------------------------

    // Set paths
    require.config({
        paths: {
            echarts: 'assets/js/plugins/visualization/echarts'
        }
    });


    // Configuration
    require(
        [
            'echarts',
            'echarts/theme/limitless',
            'echarts/chart/line',
            'echarts/chart/bar'
        ],


        // Charts setup
        function (ec, limitless) {

            // Init
            //var sales = ec.init(document.getElementById('sales'), limitless);
            var daily_stats = ec.init(document.getElementById('daily_stats'), limitless);


            d = ['Q1 1995','Q2 1995','Q3 1995','Q4 1995',]
            // Daily stats chart options
            daily_stats_options = {

                // Setup grid
                grid: {
                    x: 40,
                    x2: 40,
                    y: 35,
                    y2: 25
                },

                // Add tooltip
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                // Enable drag recalculate
                calculable: true,

                // Add legend
                legend: {
                    data: ['Visits','Sales','']
                },

                // Horizontal axis
                xAxis: [{
                    type: 'category',
                    data: d
                }],

                // Vertical axis
                yAxis: [
                    {
                        type: 'value',
                        name: 'Visits',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },  
                    {
                        type: 'value',
                        name: 'Sales',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                
                // Add series
                series: [

                    {
                        name: 'Visits',
                        type: 'bar',
                        data: [1690,1111,1784,1111,100]
                    },
                    {
                        name: 'Sales',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [503,466,434,494]
                    }
                ]
            };


            // Apply options
           // sales.setOption(sales_options);
            daily_stats.setOption(daily_stats_options);


            // Resize charts
            window.onresize = function() {
                setTimeout(function() {
                    //sales.resize();
                    daily_stats.resize();
                }, 200)
            }


            // Resize in tabs
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                //sales.resize();
                daily_stats.resize();
            });
        }
    );



    
});
