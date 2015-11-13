/*to get the quarter,city,sector and round info when document loads*/
$(document).ready(function(){
	getInvestmentInfo();
	/*to display correct filter option when clicked on city, sector or round*/
	$("#filter-option a").click(function(){
		$(".filter-info").css({'display' : 'none'}).removeClass("filter-info");
		var id = $(this).attr("id").split("-")[0]
		$("#"+id +"-info").addClass("filter-info").css({'display' : 'block'})
	})

	/* to clear everything */
	$("#clearAll").click(function(){
		$("#fromDateDiv").remove();
		$("#toDateDiv").remove();
		$("#city-info").html("");
		$('#sector-info').html("");
		$('#round-info').html("");
		getInvestmentInfo();
		basicChartCreate();
	})


});
/* */
function getInvestmentInfo()
{
	$.ajax({
		url : "investmentinfo.php",
		type : "GET",
		success : function(result)
		{
			result = JSON.parse(result);
			quarter = result.quarter;
			city = result.city;
			sector = result.sector;
			round = result.round;

			/*to add from and to quarter filter*/
			var option_fromDate = "";
			for( i in quarter)
			{
				option_fromDate += "<option value='"+ i+"'>"+quarter[i]+"</option>";
			}
			$("<div id='fromDateDiv' class='col-md-2'><select id='fromDate'>"+ option_fromDate +"</select></div>").appendTo("#filter");

			var option_toDate = "";
			sorted = [];
			for( var i in quarter)
			{
				sorted.push([i,quarter[i]]);
			}
			sorted.sort(function(a,b){ return b[0] - a[0]});
			for(i = 0; i < sorted.length; i++)
			{
				option_toDate += "<option value='"+ sorted[i][0]+"'>"+ sorted[i][1]+"</option>"
			}
			$("<div id='toDateDiv' class='col-md-2'><select id='toDate'>"+ option_toDate +"</select></div>").appendTo("#filter");

			/*to add city */
			var city_chekcbox = "";
			for( i in city)
			{
				city_chekcbox += "<input type='checkbox' value='"+ city[i]+"'>"+ city[i]+"<br>";
			}
			$(city_chekcbox).appendTo("#city-info");

			/*to add sector*/
			var sector_chekcbox = "";
			for( i in sector)
			{
				sector_chekcbox += "<input type='checkbox' value='"+ sector[i]+"'>"+ sector[i]+"<br>";
			}
			$(sector_chekcbox).appendTo("#sector-info");

			/*to add round*/
			var round_chekcbox = "";
			for( i in round)
			{
				round_chekcbox += "<input type='checkbox' value='"+ round[i]+"'>"+ round[i]+"<br>";
			}
			$(round_chekcbox).appendTo("#round-info");

		}
	});

}

var city_selected = [];
var sector_selected = [];
var round_selected = [];
var fromDate = [];
var toDate = [];
/*to make ajax call when checkbox or quarter selection is selected*/
$(document).on('change', '[type=checkbox]', function (e) {
	city_selected = [];
	sector_selected = [];
	round_selected = [];
	$("#city-info input:checkbox:checked").each(function(index){
		if( city_selected.indexOf($(this).val()) < 0)
		{
			city_selected.push($(this).val());
		}
	});
	$("#sector-info input:checkbox:checked").each(function(index){
		if( sector_selected.indexOf($(this).val()) < 0)
		{
			sector_selected.push($(this).val());
		}
	});
	$("#round-info input:checkbox:checked").each(function(index){
		if( round_selected.indexOf($(this).val()) < 0)
		{
			round_selected.push($(this).val());
		}
	});
	fromDate = $("#fromDate").val();
	toDate = $("#toDate").val();
	createchart();

});
$(document).on('change','select',function(e){
	$("#city-info input:checkbox:checked").each(function(index){
		city_selected.push($(this).val());
	});
	$("#sector-info input:checkbox:checked").each(function(index){
		sector_selected.push($(this).val());
	});
	$("#round-info input:checkbox:checked").each(function(index){
		round_selected.push($(this).val());
	});
	fromDate = $("#fromDate").val();
	toDate = $("#toDate").val();
	createchart();
});

/*function to make ajax call*/
function createchart()
{
	data = {
		fromDate : fromDate,
		toDate : toDate,
		city_selected : city_selected,
		sector_selected : sector_selected,
		round_selected : round_selected
	}
	$.ajax({
		url : "ajax.php",
		type : "POST",
		data : data,
		success : function(result)
		{
			var result = JSON.parse(result);	
			xaxis = result.xaxis;
			console.log(xaxis.length)
			investment = result.investment;
			deals = result.deals;

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

			            
			            // Daily stats chart options
			            daily_stats_options = {

			                // Setup grid
			                grid: {
			                    x: 84,
			                    x2: 84,
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
			                //calculable: true,

			                // Add legend
			                legend: {
			                    data: ['Investment','Number Of Deals']
			                },

			                // Horizontal axis
			                xAxis: [{
			                    type: 'category',
			                    data: xaxis
			                }],

			                // Vertical axis
			                yAxis: [
			                    {
			                        type: 'value',
			                        name: 'Investment',
			                        axisLabel: {
			                            formatter: '{value}'
			                        }
			                    },  
			                    {
			                        type: 'value',
			                        name: 'Number Of Deals',
			                        axisLabel: {
			                            formatter: '{value}'
			                        }
			                    }
			                ],
			                
			                // Add series
			                series: [

			                    {
			                        name: 'Investment',
			                        type: 'bar',
			                        data: investment
			                    },
			                    {
			                        name: 'Number Of Deals',
			                        type: 'line',
			                        yAxisIndex: 1,
			                        data: deals
			                    }
			                ]
			            };


			            // Apply options
			           // sales.setOption(sales_options);
			           if( xaxis.length > 0)
			           	{
			            	daily_stats.setOption(daily_stats_options);
			            }


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


		}
	})
	
}
$(document).ready(function(){
	basicChartCreate();
})

function basicChartCreate()
{
	$.ajax({
		url : "ajax.php",
		type : "GET",
		success : function(result)
		{
			var result = JSON.parse(result);	
			xaxis = result.xaxis;
			investment = result.investment;
			deals = result.deals;

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

			            
			            // Daily stats chart options
			            daily_stats_options = {

			                // Setup grid
			                grid: {
			                    x: 84,
			                    x2: 84,
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
			                //calculable: true,

			                // Add legend
			                legend: {
			                    data: ['Investment','Number Of Deals']
			                },

			                // Horizontal axis
			                xAxis: [{
			                    type: 'category',
			                    data: xaxis
			                }],

			                // Vertical axis
			                yAxis: [
			                    {
			                        type: 'value',
			                        name: 'Investment',
			                        axisLabel: {
			                            formatter: '{value}'
			                        }
			                    },  
			                    {
			                        type: 'value',
			                        name: 'Number Of Deals',
			                        axisLabel: {
			                            formatter: '{value}'
			                        }
			                    }
			                ],
			                
			                // Add series
			                series: [

			                    {
			                        name: 'Investment',
			                        type: 'bar',
			                        data: investment
			                    },
			                    {
			                        name: 'Number Of Deals',
			                        type: 'line',
			                        yAxisIndex: 1,
			                        data: deals
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



		}
	})
}