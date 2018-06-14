class onInit{

	run(){
		this.urlLowercase();
	}

	urlLowercase() {
		let href = window.location.hash;

		window.location.hash = href.toLowerCase();
	}

}

export default onInit;
