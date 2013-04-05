GDP = {
	config: {
		projectName: "github-open-data-portal",
		userName: "alangrafu",
		rootDir: "data"
	},
	render: function(divId){
		var self = this;
		var sizeSuffixes = [" bytes", "KB", "MB", "GB", "TB", "HB"];
		var $div = $(divId);
		var $table = $("<table id='open-datasets' class='dataset-table dataset-table-element'></table>");
		$table.prependTo($div);
		var $input = $("<input id='search-datasets' value='' class='search-dataset'/>");
		$input.prependTo($div);
		$("<label id='label-search-datasets' for='search-datasets' class='search-dataset'>Search  </label>").prependTo($div);

		var url = "https://api.github.com/repos/"+self.config.userName+"/"+self.config.projectName+"/contents/"+self.config.rootDir
		$.ajax({
			url: url,
			timeout: 10000,
			dataType: "jsonp",
			success: function(data){
				var sorted = [];
				if(data.data.message != undefined){
					$div.append("<p><strong>Couldn't connect with repository</strong></p><p>Message: "+data.data.message+"</p>");
					return;
				}
				for(var key in data.data){
					sorted[sorted.length] = data.data[key].name;
				}
				sorted.sort(function (a, b) {
					return a.toLowerCase().localeCompare(b.toLowerCase());
				});
				$.each(sorted, function(i, item){
					var current = self.findElem(data.data, item);
					if(current.type == "file"){
						var fileUrl = current.html_url.replace("\/blob\/", "/raw/");
						var fileName = current.name;
						var size = parseInt(current.size);
						var suffixCounter = 0;
						while(size >1023){
							size = parseInt(size/1024);
							suffixCounter++;
						}
						var row = $("<tr class='dataset-table-element'><td class='dataset-table-element'><a href='"+fileUrl+"'>"+fileName+"</a></td><td>"+size+sizeSuffixes[suffixCounter]+"</td></tr>")
						$table.append(row);					
					}
				})
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				$div.append("<p><strong>Couldn't connect with repository</strong></p>");
			}
		});
$input.on('keyup', function(){
	var string = $input.val();
	$table.find('tr').each(function(i, item){
		var trMatches = false;
		$(item).find('td').each(function(j, jtem){
			var $myElem = $(jtem);
			while($myElem.children().length > 0 ){
				$myElem = $myElem.children(":first");
			}
			matches = $myElem.html().toLowerCase().indexOf(string.toLowerCase())
			if(matches > -1){
				trMatches = true;
			}
		})
		if(trMatches){
			$(item).css("display", "")
		}else{
			$(item).css("display", "none")
		}
	});
});
},
findElem: function(arr, elem){
	for(var i=0,l=arr.length;i<l;i++)
		if(arr[i].name === elem)
			return arr[i];
		return null; 
	}   
};