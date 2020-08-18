function generateKey(btn) {
	if (btn) {
		btn.stopPropatation = true;
		btn.cancelBubble = true;
	}
	let keySize = parseInt(document.getElementById('select_key_size').value);
	let crypt = new JSEncrypt({
		default_key_size: keySize
	});
	if (btn) btn.innerText = '正在生成...';
	new Promise(function(resolve) {
		setTimeout(function() {
			resolve([crypt.getPrivateKey(), crypt.getPublicKey()]);
		},
		50);
	}).then(function(e) {
		document.getElementById('area_private_key').value = e[0];
		document.getElementById('area_public_key').value = e[1];
		if (btn) btn.innerText = '生成密钥';
	});
}

function encrypt() {
	let cipher_text = '';
	let original_text = document.getElementById('area_original_text').value;
	let public_key = document.getElementById('area_public_key').value;
	let key = public_key.substring(public_key.toUpperCase().indexOf("KEY-----") + 9, public_key.toUpperCase().indexOf("-----END") - 1);
	let keyLength = sizeof(key);
	let keySize = 0
	if (keyLength < 66) { keySize = 5; } else if (keyLength < 88) { keySize = 21; } else if (keyLength < 133) { keySize = 53; } else if (keyLength < 225) { keySize = 117; } else if (keyLength < 404) { keySize = 245; } else if (keyLength < 577) { keySize = 373; } else { keySize = 501; }
	let txetSize = sizeof(original_text);
	let times = Math.ceil(txetSize / keySize);
	let splitText = '';
	let stringIndex = 0;
	if (original_text && public_key) {
		for (i = 0; i < times; i++) {
			splitText = '';
			let enoughLength = false;
			while (!enoughLength) {
				let nextChar = original_text.substr(stringIndex, 1);
				if (nextChar == '') {
					break;
				}
				let testText = splitText + nextChar;
				if (sizeof(testText) > keySize) {
					enoughLength = true;
				} else {
					splitText = testText;
					stringIndex++;
				}
			}
			let encryptedText = getEncrypt(splitText, public_key);
			cipher_text += encryptedText;
			if (i < times - 1) {
				cipher_text += '|';
			}
		}
	} else if (!public_key) {
		document.getElementById('area_public_key').value = 'Need Public Key';
	}
	document.getElementById('area_cipher_text').value = cipher_text;
}

function getEncrypt(original_text, public_key) {
	let crypt = new JSEncrypt();
	crypt.setPublicKey(public_key);
	return crypt.encrypt(original_text) || ''
}

function decrypt() {
	let original_text = '';
	let cipher_text = document.getElementById('area_cipher_text').value;
	let private_key = document.getElementById('area_private_key').value;
	if (cipher_text && private_key) {
		let cipherSplit = cipher_text.split('|');
		for (i in cipherSplit) {
			let decryptText = getDecrypt(cipherSplit[i], private_key);
			original_text += decryptText;
		}
	} else if (!private_key) {
		document.getElementById('area_private_key').value = 'Need Private Key';
	}
	document.getElementById('area_original_text').value = original_text
}

function getDecrypt(cipher_text, private_key) {
	let crypt = new JSEncrypt();
	crypt.setPrivateKey(private_key);
	return crypt.decrypt(cipher_text) || ''
}

function sizeof(str){
	let total = 0;
	let charCode, i, len;
	for (i = 0, len = str.length; i < len; i++) {
		charCode = str.charCodeAt(i);
		if (charCode <= 0x007f) {
			total += 1;
		} else if (charCode <= 0x07ff) {
			total += 2;
		} else if (charCode <= 0xffff) {
			total += 3;
		} else {
			total += 4;
		}
	}
	return total;
}
