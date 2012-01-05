google.load("visualization", "1", {packages:["corechart"]});
var myTree = null;
$(function(){
	$('#proj_details').show();
	$('#alts').hide();
	$('#criteria').hide();
	$('#eval').hide();
	$('#eval_alt').hide();
	$('#report').hide();

	$( "#accordion" ).accordion({
		collapsible: true
	});
	
	$( "#progressbar" ).progressbar({
			value: 0
		});
	
	myTree = new ECOTree('myTree','graph');
	myTree.config.colorStyle = ECOTree.CS_LEVEL;
	myTree.config.nodeFill = ECOTree.NF_FLAT;
	myTree.config.useTarget = false;
	myTree.config.selectMode = ECOTree.SL_NONE;
	myTree.config.defaultNodeWidth = 120;
	myTree.config.defaultNodeHeight = 50;
	myTree.config.iSubtreeSeparation = 20;
	myTree.config.iSiblingSeparation = 15;
	myTree.config.iLevelSeparation = 30;
})

var src_form;
var trg_form;
function callback() {
	$( "#" + trg_form).effect( "slide", {}, 500, function(){} );
	$("#" + src_form).hide();
};

function animation(){
	$("#" + src_form).effect( "drop", {}, 200, callback );
}

var progress = 0;
function next(trg){
	if(trg == 2){
		pass = handleProjDetails();
		if (!pass)
			return;
		src_form = 'proj_details';
		trg_form = 'alts';
		animation();
		$('#title').html("Setting Alternatives");
	}else if(trg == 3){
		pass = handleAlts();
		if (!pass)
			return;
		src_form = 'alts';
		trg_form = 'criteria';
		animation();
		$('#title').html("Setting Criteria");
	}else if(trg == 4){
		pass = handleCriteria();
		if (!pass)
			return;
		src_form = 'criteria';
		trg_form = 'eval';
		animation();
		$('#title').html("Compare Criteria");
		prepairCrtLvl();
	}else if(trg == 5){
		src_form = 'eval';
		trg_form = 'eval_alt';
		animation();
		prepairCrtLvlAlt();
		$('#title').html("Compare Alternatives");
	}else if(trg == 6){
		src_form = 'eval_alt';
		$('#report').show();
		$('#eval_alt').hide();
		prepairReport();
	}
	progress = progress + 20; 
	$( "#progressbar" ).progressbar("value", progress);
}

proj_name = '';
proj_obj  = '';
proj_desc = '';
function handleProjDetails(){
	proj_name = $('#proj_name').val();
	proj_obj  = $('#proj_obj').val();
	proj_desc  = $('#proj_desc').val();
	if(proj_name == '' || proj_obj == ''){
		return false;
	}
	addToTree(0, -1, proj_obj);
	$('#proj_name').val('');
	$('#proj_obj').val('');
	$('#proj_desc').val('');
	return true;
}

function handleAlts(){
	if(alts.length < 2){
		alert('Enter At Least 2 Alternatives.')
		return false;
	}
	return true;
}

function handleCriteria(){
	if(crts.length < 2){
		alert('Enter At Least 2 Criteria.')
		return false;
	}
	return true;
}

alts = [];
alts_desc = [];
function add_alt(){
	alt_name = $('#alt_name').val();
	alt_desc = $('#alt_desc').val();
	if(alt_name == ''){
		alert("Please Enter The Alternative Name.");
		return false;
	}
	if( indexOf(alts, alt_name) != -1 ){
		alert("This Alternative Is Allready Exist.");
		return false;
	}
	alts.splice(alts.length,0,alt_name);
	alts_desc.splice(alts_desc.length,0,alt_desc);
	
	$('#alt_tbl > tbody:last').append('<tr> <td class="alt_td">' + alt_name + '</td> <td class="alt_td">' + alt_desc + '</td> </tr>');
	
	$('#alt_name').val('');
	$('#alt_desc').val('');
}

crts = [];
crts_prn = [];
crts_desc = [];
function add_crt(){
	crt_sel =  $('#crt_sel').val();
	crt_name =  $('#crt_name').val();
	crt_desc =  $('#crt_desc').val();
	
	if(crt_name == ''){
		alert("Please Enter The Criterion Name.");
		return false;
	}
	
	if( indexOf(crts, crt_name) != -1 ){
		alert("This Criterion Is Allready Exist.");
		return false;
	}
	
	crts.splice(crts.length,0,crt_name);
	crts_desc.splice(crts_desc.length,0,crt_desc);
	crts_prn.splice(crts_prn.length,0,crt_sel);
	
	addToTree(crts.length, parseInt(crt_sel) + 1, crt_name);
	$('#crt_sel').append($("<option />").val(crts.length-1).text(crt_name));
	
	$('#crt_name').val('');
	$('#crt_desc').val('');
}

function addToTree(idx, prn_idx, text){		
	myTree.add(idx,prn_idx, "<div align='center' valign='middle'> <font color='#ffDD44' size=4> " + text + "</font> </div>");
	myTree.UpdateTree();
}

crt_prn_found = [];
crt_sub_idx = [];
crt_prn_idx = [];
function prepairCrtLvl(){
	free_col = [];
	for (i = crts_prn.length-1; i >= 0; i--){
		fc = 1;
		idx = crts_prn[i];
		while(idx != -1){
			fc += 1;
			idx = crts_prn[idx];
			if(idx == 0){
				fc += 1;
				break;
			}
		}
		free_col.splice(0,0,fc);
	}
	
	crt_sorted = [];
	idx_sorted = [];
	clickable  = [];
	// collect first Level
	for(i = 0; i < crts_prn.length; i++){
		if(crts_prn[i] == -1){
			crt_sorted.splice(crt_sorted.length,0,crts[i]);
			idx_sorted.splice(idx_sorted.length,0,i);
			crt_prn_idx.splice(crt_prn_idx.length, 0, i);
		}
	}
	// collect remains Levels
	for (idx = 0; idx < crts.length; idx++){
		txt = crts[idx];
		txt_idx = indexOf(crt_sorted, txt);
		sub_idx = [];
		found = false;
		for (i = 0; i < crts_prn.length; i++){
			if(crts_prn[i] == idx){
				found = true;
				crt_sorted.splice(txt_idx+1,0,crts[i]);
				idx_sorted.splice(txt_idx+1,0,i);
				sub_idx.splice(sub_idx.length,0,i);
				txt_idx++;
			}
		}
		crt_sub_idx.splice(idx, 0, sub_idx);
		if(found){
			crt_prn_found.splice(idx, 0, idx);
		}else{
			crt_prn_found.splice(idx, 0, -2);
		}
	}
	
	// Build Table
	$('#crt_lvls > tbody:last').append('<tr> <td onclick="crt_eval(-1);" class="clickable" >' + proj_obj + '</td> </tr>');
	for (i = 0; i < idx_sorted.length; i++){
		text = crts[idx_sorted[i]];
		fc   = free_col[idx_sorted[i]];
		free_space = "";
		for(j = 0; j < fc; j++){
			free_space += '<td></td>';
		}
		click_cmd = '';
		if (crt_prn_found[indexOf(crts, text)] != -2){
			click_cmd = 'onclick="crt_eval('+ crt_prn_found[indexOf(crts, text)] +');" class="clickable" ';
		}
		$('#crt_lvls > tbody:last').append('<tr> ' + free_space + ' <td ' + click_cmd + '>' + text + '</td> </tr>');
	}
	
	buildMatrices();
}

var crt_lvl_alt_idx = [];
var crt_lvl_alt_mat = [];
var crt_lvl_alt_prb = [];
var crt_lvl_alt_prb_local = [];
function prepairCrtLvlAlt(){
	// found leaf criteria
	for (var idx = 0; idx < crts.length; idx++){
		var found = false;
		for (var i = 0; i < crts_prn.length; i++){
			if(crts_prn[i] == idx){
				found = true;
				break;
			}
		}
		if(found){
			crt_lvl_alt_idx.splice(idx, 0, -2);
			crt_lvl_alt_mat.splice(idx, 0, -2);
			crt_lvl_alt_prb.splice(idx, 0, -2);
			crt_lvl_alt_prb_local.splice(idx, 0, -2);
		}else{
			crt_lvl_alt_idx.splice(idx, 0, idx);
			var mat = create2Dmat(alts.length);
			crt_lvl_alt_mat.splice(idx, 0, mat);
			crt_lvl_alt_prb.splice(idx, 0, []);
			crt_lvl_alt_prb_local.splice(idx, 0, []);
		}
	}
	
	// Build Table
	$('#crt_lvls_alt > tbody:last').append('<tr> <td style="width: 20%;">' + proj_obj + '</td> </tr>');
	for (i = 0; i < crt_lvl_alt_idx.length; i++){
		var click_cmd = '';
		if (crt_lvl_alt_idx[i] != -2){
			click_cmd = 'onclick="crt_eval_alt('+ crt_lvl_alt_idx[i] +');"';
			$('#crt_lvls_alt > tbody:last').append('<tr> <td> </td> <td ' + click_cmd + ' class="clickable" >' + crts[i] + '</td> </tr>');
		}
		
	}
}


function crt_eval_alt(idx){
	// clear table
	var rows = $('#eval_tbl_alt >tbody >tr').length;
	while(rows >= 1){
		$('#eval_tbl_alt tbody tr:last').remove();
		rows = rows - 1;
	}
	var mat = crt_lvl_alt_mat[idx];

	for(var i = 0; i < alts.length-1; i++){
		for (var j = i+1; j < alts.length; j++){
			crt_src = alts[i];
			crt_trg = alts[j];
			val = mat[j][i];
			val_idx = indexOf(eval_values, val);
			slider_name = 'alt_slider-' + i + '_' + j;
			slider_label = 'alt_slider_label-' + i + '_' + j;
			lbl = eval_values_lbl[val_idx];
			$('#eval_tbl_alt > tbody:last').append('<tr> <td align="center" width="20%">' + crt_src + ' </td> <td valign="middle" align="center" width="60%"> <div id="' + slider_label + '"> ' + lbl + ' </div> <br/> <div id="' + slider_name + '"> </div> </td> <td align="center" width="20%">' + crt_trg + '</td> </tr>');
			$('#' + slider_name).slider({ min: 0, max: 8, step: 1, value: val_idx, change: function(event, ui){
											id = this.id;
											id = id.split('-');
											slider_label = '#alt_slider_label-' + id[1];
											$(slider_label).html(eval_values_lbl[ui.value]);
											
											idxs = id[1].split('_');
											src_idx = idxs[0];
											trg_idx = idxs[1];
											val_idx = ui.value;
											val = eval_values[val_idx];
											var mat = crt_lvl_alt_mat[idx];
											var m = getModified(mat, src_idx, trg_idx, val);
											slider_id = this.id;
											$.ajax({
												url : '/checkMat?m='+m,
												success : function(js) {
													js = eval ( '(' + js + ')');
													if (js.length > 0){
														mat[trg_idx][src_idx] = val;
														mat[src_idx][trg_idx] = 1/val;
														crt_lvl_alt_prb_local[idx] = js;
														var crt_prob = crt_probs[idx];
														var global_prob = [];
														for(var k = 0; k < alts.length; k++){
															global_prob.splice(k,0,(js[k] * crt_prob));
														}
														crt_lvl_alt_prb[idx] = global_prob;
														//updateGraph(js, curr_crt_idx);
													}else{
														val = mat[trg_idx][src_idx];
														val_idx = indexOf(eval_values, val);
														$('#' + slider_id).slider("option", "value", val_idx);
													}
												},
												cache : false
											});
										}});			
		}
	}
}

crt_probs = [];
crt_mat = [];
crt_prn_mat = [];
function buildMatrices(){
	num_crt_prn = crt_prn_idx.length;
	for (var i = 0; i < crt_prn_idx.length; i++){
		crt_probs[crt_prn_idx[i]] = 1/num_crt_prn;
		crt_local_probs[crt_prn_idx[i]] = 1/num_crt_prn;
	}
	crt_prn_mat = create2Dmat(num_crt_prn);
	
	for (var i = 0; i < crt_sub_idx.length; i++){
		sub_idx = crt_sub_idx[i];
		crt_mat[i] = [];
		if (sub_idx.length > 0){
			num_sub_crt = sub_idx.length;
			for (var j = 0; j < num_sub_crt; j++){
				crt_probs[sub_idx[j]] = 1/num_sub_crt;
				crt_local_probs[sub_idx[j]] = 1/num_sub_crt;
			}
			mat = create2Dmat(num_sub_crt);
			crt_mat[i] = mat;
		}
	}
}

function create2Dmat(d){
	var mat = [];
	for(var n = 0; n < d; n++){
		c = [];
		for(var m = 0; m < d; m++){
			c.splice(c.length, 0, 1);
		}
		mat.splice(mat.length, 0, c);
	}
	return mat;
}

function indexOf(arr, elm){
	for(var i = 0; i < arr.length; i++){
		if(arr[i] == elm)
			return i;
	}
	return -1;
}

eval_values     = [1/9, 1/7, 1/5, 1/3, 1, 3, 5, 7, 9];
eval_values_lbl = [9, 7, 5, 3, 1, 3, 5, 7, 9];
curr_crt_idx = '';
function crt_eval(idx){
	
	// clear evaluation table 
	var rows = $('#eval_tbl >tbody >tr').length;
	while(rows >= 1){
		$('#eval_tbl tbody tr:last').remove();
		rows = rows - 1;
	}
	
	curr_crt_idx = idx;
	crt = [];
	for(i = 0; i < crts_prn.length; i++){
		if(crts_prn[i] == idx){
			crt.splice(crt.length,0,crts[i]);
		}
	}
	var mat = [];
	if (idx == -1){
		mat = crt_prn_mat;
	}else{
		mat = crt_mat[idx];
	}
	for(var i = 0; i < crt.length-1; i++){
		for (var j = i+1; j < crt.length; j++){
			crt_src = crt[i];
			crt_trg = crt[j];
			val = mat[j][i];
			val_idx = indexOf(eval_values, val);
			slider_name = 'slider-' + i + '_' + j;
			slider_label = 'slider_label-' + i + '_' + j;
			lbl = eval_values_lbl[val_idx];
			$('#eval_tbl > tbody:last').append('<tr> <td align="center" width="20%">' + crt_src + ' </td> <td valign="middle" align="center" width="60%"> <div id="' + slider_label + '"> ' + lbl + ' </div> <br/> <div id="' + slider_name + '"> </div> </td> <td align="center" width="20%">' + crt_trg + '</td> </tr>');
			$('#' + slider_name).slider({ min: 0, max: 8, step: 1, value: val_idx, change: function(event, ui){
											id = this.id;
											id = id.split('-');
											slider_label = '#slider_label-' + id[1];
											$(slider_label).html(eval_values_lbl[ui.value]);
											
											idxs = id[1].split('_');
											src_idx = idxs[0];
											trg_idx = idxs[1];
											val_idx = ui.value;
											val = eval_values[val_idx];
											if (curr_crt_idx == -1){
												mat = crt_prn_mat;
											}else{
												mat = crt_mat[idx];
											}
											m = getModified(mat, src_idx, trg_idx, val);
											slider_id = this.id;
											$.ajax({
												url : '/checkMat?m='+m,
												success : function(js) {
													js = eval ( '(' + js + ')');
													if (js.length > 0){
														mat[trg_idx][src_idx] = val;
														mat[src_idx][trg_idx] = 1/val;
														updateGraph(js, curr_crt_idx);
													}else{
														val = mat[trg_idx][src_idx];
														val_idx = indexOf(eval_values, val);
														$('#' + slider_id).slider("option", "value", val_idx);
													}
												},
												cache : false
											});
										}});			
		}
	}
	
}

function updateGraph(prob, idx){
	var list_idx = _updateGraph(prob, idx);
	for(var i = 0; i < list_idx.length; i++){
		var probs = getProbs(list_idx[i]);
		if(probs.length > 0){
			var tmp = _updateGraph(probs, list_idx[i]);
			if(tmp.length > 0){
				for(var j = 0; j < tmp.length; j++){
					list_idx.splice(list_idx.length, 0, tmp[j]);
				}
			}
		}
	}
}

var crt_local_probs = [];
function _updateGraph(prob, idx){
	prob_prn = 1;
	if (idx != -1){
		prob_prn = crt_probs[idx];
	}
	
	var crt = [];
	for(var i = 0; i < crts_prn.length; i++){
		if(crts_prn[i] == idx){
			crt.splice(crt.length,0,i);
		}
	}
	for(var i = 0; i < crt.length; i++){
		var new_prob = prob_prn * prob[i];
		crt_probs[crt[i]] = new_prob;
		crt_local_probs[crt[i]] = prob[i];
		title = '<center> ' + crts[crt[i]] + '<br>' + Math.round( (prob_prn * prob[i]) *100)/100 + '</center>';
		myTree.setNodeTitle(indexOf(crts, crts[crt[i]])+1, title, true);
	}
	return crt;
}

function getProbs(idx){
	var crt = [];
	for(var i = 0; i < crts_prn.length; i++){
		if(crts_prn[i] == idx){
			crt.splice(crt.length,0,i);
		}
	}
	var new_prob = [];
	if(crt.length > 0){
		var new_prob = [];
		for(var i = 0; i < crt.length; i++){
			new_prob.splice(new_prob.length, 0, crt_local_probs[crt[i]]);
		}
	}
	return new_prob;
}

function getModified(mat, src_idx, trg_idx, val){
	var c = mat.length;
	var r = mat[0].length;
	var m = '';
	for(var i = 0; i < c; i++){
		for(var j = 0; j < r; j++){
			if(i == trg_idx && j == src_idx){
				m += val;
			}else if(j == trg_idx && i == src_idx){
				m += 1/val;
			}else{
				m += mat[i][j];
			}
			m += ',';
		}
		m += '_';
	}
	return m;
}

function prepairReport(){
	var collect_alt_prob = [];
	for (var j = 0; j < alts.length; j++){
		var sum = 0;
		for (var i = 0; i < crt_lvl_alt_idx.length; i++){
			if(crt_lvl_alt_idx[i] != -2)
				sum += crt_lvl_alt_prb[i][j];
		}
		collect_alt_prob[j] = sum;
	}
	
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Alternatives');
	data.addColumn('number', 'Total Propability');
	var tmp = [];
	for (var k = 0; k < collect_alt_prob.length; k++){
		tmp.splice(tmp.length, 0, [alts[k], collect_alt_prob[k]]);
	}
	data.addRows(tmp);
	var chart = new google.visualization.ColumnChart(document.getElementById("result_div"));
	var option = {width: 500, height: 250, title: "AHP Result",
				hAxis: {title: 'Alternatives', titleTextStyle: {color: 'red'}},
				vAxis: {title: 'Probabilities', titleTextStyle: {color: 'red'}}
				};
	chart.draw(data, option);
}