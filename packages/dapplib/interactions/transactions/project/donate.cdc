
import Faucet from Project.Faucet
import RegistryFTContract from Project.RegistryFTContract

transaction(amount: UFix64) {
    let tenant: &RegistryFTContract.Tenant{RegistryFTContract.ITenant}
    let vault: &RegistryFTContract.Vault
    let donater: Address
    prepare(signer: AuthAccount) {
        self.tenant = signer.borrow<&RegistryFTContract.Tenant{RegistryFTContract.ITenant}>(from: RegistryFTContract.TenantStoragePath)
                                ?? panic("Unable to borrow tenant")
        self.vault = signer.borrow<&RegistryFTContract.Vault>(from: RegistryFTContract.VaultStoragePath)
			?? panic("Could not borrow reference to the owner's Vault!")
        self.donater = signer.address
    }
    execute {
        let amt <- self.vault.withdraw(amount: amount)
        Faucet.donate(donater: self.donater, from: <- amt)
    }
}
