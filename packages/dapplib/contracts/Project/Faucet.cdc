import RegistrySampleContract from Project.RegistrySampleContract
import FungibleToken from Flow.FungibleToken

// This is a blank ComposedContract template. It imports
// the blank RegistrySampleContract template because you will
// use that in here.

pub contract Faucet {

    access(contract) var donateRecords: {Address: UFix64}
    access(contract) let vault: @RegistrySampleContract.Vault

    // Anyone can donate to this faucet
    pub fun donate(donater: Address, from: @FungibleToken.Vault) {
        if let balance = self.donateRecords[donater] {
            self.donateRecords[donater] = balance + from.balance
        } else {
            self.donateRecords[donater] = from.balance
        }
        self.vault.deposit(from: <- from)
    }

    // Anyone can take token from this faucet,
    // but the maximum amount is 1.0
    pub fun take(amount: UFix64): @FungibleToken.Vault {
        pre {
            amount < 1.0: "Max amount is 1.0"
        }
        return <- self.vault.withdraw(amount: amount)
    }

    init() {
        self.donateRecords = {}
        self.vault <- RegistrySampleContract.createEmptyVault()
    }
}