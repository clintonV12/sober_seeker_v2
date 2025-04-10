function showMsgToast(message){
	document.getElementById("toast-msg").innerHTML = message;
	const toastPlacementEx = document.querySelector('.toast-placement-ex');
	let selectedType, selectedPlacement, toastPlacement;
		
	selectedType = "bg-secondary";
	selectedPlacement = "top-5 start-50 translate-middle-x".split(' ');

	toastPlacementEx.classList.add(selectedType);
	DOMTokenList.prototype.add.apply(toastPlacementEx.classList, selectedPlacement);
	toastPlacement = new bootstrap.Toast(toastPlacementEx);
	toastPlacement.show();
}