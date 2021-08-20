import FungibleToken from Flow.FungibleToken
import RegistryFTContract from Project.RegistryFTContract
import Faucet from Project.Faucet

transaction(amount: UFix64) {
    let tenant: &RegistryFTContract.Tenant{RegistryFTContract.ITenant}
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tenant = signer.borrow<&RegistryFTContract.Tenant{RegistryFTContract.ITenant}>(from: RegistryFTContract.TenantStoragePath)
                                ?? panic("Unable to borrow tenant")

        self.tokenReceiver = signer.getCapability(RegistryFTContract.ReceiverPublicPath)
                                .borrow<&{FungibleToken.Receiver}>()
                                ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let amt <- Faucet.take(amount: amount)

        self.tokenReceiver.deposit(from: <-amt)
    }
}