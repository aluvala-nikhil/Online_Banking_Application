# Online-banking application

# Sprint-1: Should allow display of multiple accounts with balances and recent transactions. 
●	Manage the header functions
o	Login Management
o	Alert/Messages Management
o	Account Management
o	Profile Management
●	Upon clicking on login button or any button that requires the customer to be logged-in
o	open the login/register page
o	enable logging-in [user-id, password, OTP (if applicable)]
o	upon successful login, redirect to the page intended
o	upon failure, redirect to exception processing (retry, forgot password or register)
●	Upon clicking the Alert/Messages Button
o	display the current list of alerts/messages/interactions
o	allow processing of these messages
▪	open the message to view the contents/response
▪	mark as unread
▪	delete message
o	allow creating a new message/complaint/query and submit
●	Upon clicking the Account Management Button
o	Show the account categories (savings, home loan, investments, insurance, credit cart, etc.) currently linked to this login, and for each category 
▪	allow expand to view the linked accounts in that category, along with the current balance
▪	click to view more details (temporarily disabled [under construction) – enabled for Sprint-2]
▪	delete the account linking
●	Upon clicking the Profile Management Button
o	Show the personal information collect and allow options for editing (name, address, DoB, current password, preferences)
o	Mandate upload option for id proof (and/or address proof) for name, DoB and address changes.
o	Upon saving show the updated details (indicating the fields pending KYC approvals)

# Sprint-2: Should allow the user to perform a few banking transactions.
●	Manage the account functions
o	Transaction History
o	Fund Transfer (Payee Setup, Standing Instructions)
o	Make Payment (Credit Card/Home Loan)
●	Transaction History
o	Choose the search criteria (last 10 transactions, last month, date range)
o	Show the transaction history, for each transaction
▪	display additional information
o	Allow dispute of transactions (credit card)
●	Fund Transfer
o	Show the list of accounts from which funds can be transferred (savings, current)
o	Show the list of payees already setup, for each payee
▪	display additional information on request
▪	allow the payee to be selected
▪	delete the payee from the list
▪	allow an option to add a new payee to the list 
o	Upon clicking Add new payee,
▪	collect the information required for setting up a payee (Name, Bank Name, Branch Name, Account Number, etc.)
▪	allow the payee to be added and be selected from the list
o	Upon selecting the payee
▪	enter the amount that needs to be transferred
▪	indicate if a standing instruction needs to be placed for recurring payments (periodicity and number of instances)
▪	date on which the transfer should take place (or start for recurring payments)
▪	Upon clicking the confirm button, show confirmation of request
●	Make a payment
o	Select CC or HL account
o	Show the details (Balance, Last Payment, Next Payment Due, Due Date, etc.)
o	Upon clicking the Make a Payment Button, pay Bill, allowing payment from
▪	Saving Accounts
▪	Checking Accounts
o	Select the account from which payment should be made
o	Check if sufficient balance is available in the account 
o	Upon clicking the confirm button, process the payment 
o	Show the updated details on the CC/HL account
