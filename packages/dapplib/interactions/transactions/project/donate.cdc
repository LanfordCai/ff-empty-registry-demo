import Faucet from Project.Faucet
import RegistrySampleContract from Project.RegistrySampleContract


transaction(amount: UFix64) {
    let receiverRef: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        // Get a reference to the recipient's Receiver
        self.receiverRef = signer.getCapability(RegistrySampleContract.ReceiverPublicPath)
                            .borrow<&{FungibleToken.Receiver}>()
			                ?? panic("Could not borrow receiver reference to the recipient's Vault")
    }

    execute {
        let vault <- Faucet.take(amount: amount)
        self.receiverRef.deposit(from: vault)
    }
}