
export const calculaSubNet = (subNetVal, gateway) => {
    const [subnetAddress, subnetMask] = subNetVal.split('/');
    const subnetMaskBits = parseInt(subnetMask, 10);
    
    const subnetAddressArray = subnetAddress.split('.').map(Number);
    const subnetMaskArray = Array(4).fill(0).map((_, index) => index < subnetMaskBits / 8 ? 255 : 0);
    
    const minIPArray = subnetAddressArray.map((byte, index) => byte & subnetMaskArray[index]);
    minIPArray[3] += 1; // Incrementa o último octeto para obter o IP mínimo válido
    const minIP = minIPArray.join('.');
    
    const maxIPArray = subnetAddressArray.map((byte, index) => index < 3 ? byte | (~subnetMaskArray[index] & 255) : byte | (~subnetMaskArray[index] & 254));
    maxIPArray[3] -= 1; // Decrementa o último octeto para obter o IP máximo válido
    const maxIP = maxIPArray.join('.');
    
    // Compara o gateway com o minIP e o maxIP
    const gatewayInRange = gateway >= minIP && gateway <= maxIP;
    
    return gatewayInRange;
}

export const regexIpv4 = () => {
    return new RegExp(
        '^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.' +
        '(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.' +
        '(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.' +
        '(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$'
    );
}