import LocalVault from "./LocalVault.Services";

const vaultName = 'vault';
//process.env.VAULT_CLIENT_SECRET
const secrets = [];
const start = async () => {
    try {
        if (!!process.env.SECRET_FILE) {
            const vault = new LocalVault();
            const res = await vault.LoadSecrets(process.env.SECRET_FILE)
            res.map(item => secrets.push(item));
        }
    } catch (err) { }
}

export function ExistsKey(key: string): boolean {
    try {
        return !!secrets.find(element => element.key.trim().toLowerCase() == key.trim().toLowerCase());
    } catch { }
    return false;
}


export function GetSecret(key: string, attribute: string): any {
    let secret;
    try { secret = secrets.find(element => element.key.trim().toLowerCase() == key.trim().toLowerCase()); } catch { }
    if (!secret[attribute]) throw new Error("Invalid Database Key - Not found secret");
    return secret[attribute];
}

start();

export default secrets;
