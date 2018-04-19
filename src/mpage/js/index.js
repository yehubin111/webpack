import '../../common/less/common-mobile.less';
import '../css/index.less';

$(function(){
	class FourPercent{
		constructor() {
			this.code = `000773`;
			this.url = `/interface/net/index/0_${this.code}`;

		}

		async setData() {
				let dt = await this.getData();
				 
				$('.c-module1 .data').attr('href', `/${dt.data.code}/`);
				$('.c-module1 .left .percent span').html(parseFloat(dt.data.nhsy).toFixed(2));
				$('.c-module1 .right .percent span').html(dt.data.wfsy);
				$('.c-module1 .buy a').attr('href', `https://trade.5ifund.com/trade/trade_otherTradeInit.action?fundCode=${dt.data.code}&tradeType=buy01&amount=&frm=`);
		}
 
		getData() {
				let self = this;
				return new Promise((resolve) => {
					$.getJSON(self.url, (data) => {
						resolve(data);
					})
				});
		}
	}

	const PCT = new FourPercent();
	PCT.setData();
});