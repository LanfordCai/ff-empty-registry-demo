import Faucet from Project.Faucet
import RegistrySampleContract from Project.RegistrySampleContract


transaction(amount: UFix64) {
    let tenant: &RegistrySampleContract.Tenant{RegistrySampleContract.ITenant}
    let vault: &RegistrySampleContract.Vault
    let donater: Address

    prepare(signer: AuthAccount) {
        self.tenant = signer.borrow<&RegistrySampleContract.Tenant{RegistrySampleContract.ITenant}>(from: RegistrySampleContract.TenantStoragePath)
                                ?? panic("Unable to borrow tenant")

        self.vault = signer.borrow<&RegistrySampleContract.Vault>(from: RegistrySampleContract.VaultStoragePath)
			?? panic("Could not borrow reference to the owner's Vault!")

        self.donater = signer.address
    }

    execute {
        let amt <- self.vault.withdraw(amount: amount)

        Faucet.donate(donater: self.donater, from: <- amt)
    }
}