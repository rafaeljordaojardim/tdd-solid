import { AccountModel } from "../../../domain/models/account";
import { AddAccount, AddAccountModel } from "../../../domain/usecases/add-account";
import { AddAccountRepository } from "../../protocols/db/add-account-repository";
import { Encrypter } from "../../protocols/criptography/encrypter";

export class DbAddAccount implements AddAccount {

  constructor(private encrypter: Encrypter,
    private addAccountRepository: AddAccountRepository
  ) { }
  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashPassword = await this.encrypter.encrypt(account.password)

    const accountDb = await this.addAccountRepository.add({
      ...account,
      password: hashPassword
    })

    return accountDb
  }

}