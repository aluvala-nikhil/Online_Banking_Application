# Online-banking application

# Sprint-1: 
Should allow display of multiple accounts with balances and recent transactions. <br>

●	Manage the header functions  <br>
o	Login Management  <br>
o	Alert/Messages Management  <br>
o	Account Management  <br>
o	Profile Management <br>

●	Upon clicking on login button or any button that requires the customer to be logged-in  <br>
o	open the login/register page  <br>
o	enable logging-in [user-id, password, OTP (if applicable)]  <br>
o	upon successful login, redirect to the page intended  <br>
o	upon failure, redirect to exception processing (retry, forgot password or register)  <br>

●	Upon clicking the Alert/Messages Button  <br>
o	display the current list of alerts/messages/interactions  <br>
o	allow processing of these messages  <br>
▪	open the message to view the contents/response  <br>
▪	mark as unread  <br>
▪	delete message  <br>
o	allow creating a new message/complaint/query and submit  <br>

●	Upon clicking the Account Management Button  <br>
o	Show the account categories (savings, home loan, investments, insurance, credit cart, etc.) currently linked to this login, and for each category   <br>
▪	allow expand to view the linked accounts in that category, along with the current balance  <br>
▪	click to view more details (temporarily disabled [under construction) – enabled for Sprint-2]  <br>
▪	delete the account linking  <br>

●	Upon clicking the Profile Management Button  <br>
o	Show the personal information collect and allow options for editing (name, address, DoB, current password, preferences)  <br>
o	Mandate upload option for id proof (and/or address proof) for name, DoB and address changes.  <br>
o	Upon saving show the updated details (indicating the fields pending KYC approvals)  <br>

# Sprint-2: 
Should allow the user to perform a few banking transactions.  <br>

●	Manage the account functions  <br>
o	Transaction History  <br>
o	Fund Transfer (Payee Setup, Standing Instructions)  <br>
o	Make Payment (Credit Card/Home Loan)  <br>

●	Transaction History  <br>
o	Choose the search criteria (last 10 transactions, last month, date range)  <br>
o	Show the transaction history, for each transaction  <br>
▪	display additional information  <br>
o	Allow dispute of transactions (credit card)  <br>

●	Fund Transfer  <br>
o	Show the list of accounts from which funds can be transferred (savings, current)  <br>
o	Show the list of payees already setup, for each payee  <br>
▪	display additional information on request  <br>
▪	allow the payee to be selected  <br>
▪	delete the payee from the list  <br>
▪	allow an option to add a new payee to the list   <br>
o	Upon clicking Add new payee,  <br>
▪	collect the information required for setting up a payee (Name, Bank Name, Branch Name, Account Number, etc.)  <br>
▪	allow the payee to be added and be selected from the list  <br>
o	Upon selecting the payee  <br>
▪	enter the amount that needs to be transferred  <br>
▪	indicate if a standing instruction needs to be placed for recurring payments (periodicity and number of instances)  <br>
▪	date on which the transfer should take place (or start for recurring payments)  <br>
▪	Upon clicking the confirm button, show confirmation of request  <br>

●	Make a payment  <br>
o	Select CC or HL account  <br>
o	Show the details (Balance, Last Payment, Next Payment Due, Due Date, etc.)  <br>
o	Upon clicking the Make a Payment Button, pay Bill, allowing payment from <br>
▪	Saving Accounts  <br>
▪	Checking Accounts  <br>
o	Select the account from which payment should be made  <br>
o	Check if sufficient balance is available in the account  <br>
o	Upon clicking the confirm button, process the payment  <br>
o	Show the updated details on the CC/HL account  <br>
