require('react');
require('graphql');
require('lodash');
require('subscriptions-transport-ws');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { generateApolloClient } = require('@deep-foundation/hasura/client');
const { DeepClient } = require('@deep-foundation/deeplinks/imports/client');
const {
  minilinks,
  Link,
} = require('@deep-foundation/deeplinks/imports/minilinks');
const puppeteer = require('puppeteer');
const crypto = require('crypto');
const axios = require('axios');
const uniqid = require('uniqid');
const { expect } = require('chai');
const { get } = require('lodash');
const {
  default: links,
} = require('@deep-foundation/deeplinks/imports/router/links');
const {payInBrowser} = require("./deep-packages/payments/tinkoff/payInBrowser.cjs");
const {getError} = ("./deep-packages/payments/tinkoff/getError.cjs");
const { generateToken, generateTokenStringWithInsertedTerminalPassword } = ("./deep-packages/payments/tinkoff/generateToken.cjs");
const { getUrl } = ("./deep-packages/payments/tinkoff/getUrl.cjs");
const { getState } = ("./deep-packages/payments/tinkoff/getState.cjs");
const { checkOrder } = ("./deep-packages/payments/tinkoff/checkOrder.cjs");
const { getCardList } = ("./deep-packages/payments/tinkoff/getCardList.cjs");
const { init } = ("./deep-packages/payments/tinkoff/init.cjs");
const { charge } = ("./deep-packages/payments/tinkoff/charge.cjs");
const { addCustomer } = ("./deep-packages/payments/tinkoff/addCustomer.cjs");
const { getCustomer } = ("./deep-packages/payments/tinkoff/getCustomer.cjs");
const { removeCustomer } = ("./deep-packages/payments/tinkoff/removeCustomer.cjs");
const { handlersDependencies } = ("./deep-packages/payments/tinkoff/handlersDependencies.cjs");
const { insertPayInsertHandler } = ("./deep-packages/payments/tinkoff/insertPayInsertHandler.cjs");
const { insertNotificationHandler } = ("./deep-packages/payments/tinkoff/insertNotificationHandler.cjs");
const {sleep} = require("./deep-packages/sleep.cjs");

var myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

console.log('Installing payments-tinkoff-c2b package');

const allCreatedLinkIds = [];

const installPackage = async () => {
  const apolloClient = generateApolloClient({
    path: process.env.NEXT_PUBLIC_GQL_PATH || '', // <<= HERE PATH TO UPDATE
    ssl: !!~process.env.NEXT_PUBLIC_GQL_PATH.indexOf('localhost')
      ? false
      : true,
    // admin token in prealpha deep secret key
    // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibGluayJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJsaW5rIiwieC1oYXN1cmEtdXNlci1pZCI6IjI2MiJ9LCJpYXQiOjE2NTYxMzYyMTl9.dmyWwtQu9GLdS7ClSLxcXgQiKxmaG-JPDjQVxRXOpxs',
  });

  const unloginedDeep = new DeepClient({ apolloClient });
  const guest = await unloginedDeep.guest();
  const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
  const admin = await guestDeep.login({
    linkId: await guestDeep.id('deep', 'admin'),
  });
  const deep = new DeepClient({ deep: guestDeep, ...admin });

  try {
    const User = await deep.id('@deep-foundation/core', 'User');
    const typeTypeId = await deep.id('@deep-foundation/core', 'Type');
    const anyTypeId = await deep.id('@deep-foundation/core', 'Any');
    const joinTypeId = await deep.id('@deep-foundation/core', 'Join');
    const containTypeId = await deep.id('@deep-foundation/core', 'Contain');
    const Value = await deep.id('@deep-foundation/core', 'Value');
    const String = await deep.id('@deep-foundation/core', 'String');
    const packageTypeId = await deep.id('@deep-foundation/core', 'Package');
  

    const syncTextFileTypeId = await deep.id('@deep-foundation/core', 'SyncTextFile');
    const dockerSupportsJs = await deep.id(
      '@deep-foundation/core',
      'dockerSupportsJs'
    );
    const handleInsertTypeId = await deep.id('@deep-foundation/core', 'HandleInsert');
    const portTypeId = await deep.id('@deep-foundation/core', 'Port');
    const routerListeningTypeId = await deep.id('@deep-foundation/core', 'RouterListening');
    const routerTypeId = await deep.id('@deep-foundation/core', 'Router');
    const routerStringUseTypeId = await deep.id(
      '@deep-foundation/core',
      'RouterStringUse'
    );
    const routeTypeId = await deep.id('@deep-foundation/core', 'Route');
    const handleRouteTypeId = await deep.id(
      '@deep-foundation/core',
      'HandleRoute'
    );
    const handlerTypeId = await deep.id(
      '@deep-foundation/core',
      'Handler'
    );
    const dockerSupportsJsId = await deep.id(
      '@deep-foundation/core',
      'dockerSupportsJs'
    );

    const treeTypeId = await deep.id('@deep-foundation/core', 'Tree');
    const treeIncludeNodeTypeId = await deep.id(
      '@deep-foundation/core',
      'TreeIncludeNode'
    );
    const treeIncludeUpTypeId = await deep.id('@deep-foundation/core', 'TreeIncludeUp');
    const treeIncludeDownTypeId = await deep.id(
      '@deep-foundation/core',
      'TreeIncludeDown'
    );

    const Rule = await deep.id('@deep-foundation/core', 'Rule');
    const RuleSubject = await deep.id('@deep-foundation/core', 'RuleSubject');
    const RuleObject = await deep.id('@deep-foundation/core', 'RuleObject');
    const RuleAction = await deep.id('@deep-foundation/core', 'RuleAction');
    const Selector = await deep.id('@deep-foundation/core', 'Selector');
    const SelectorInclude = await deep.id(
      '@deep-foundation/core',
      'SelectorInclude'
    );
    const SelectorExclude = await deep.id(
      '@deep-foundation/core',
      'SelectorExclude'
    );
    const SelectorTree = await deep.id('@deep-foundation/core', 'SelectorTree');
    const containTree = await deep.id('@deep-foundation/core', 'containTree');
    const AllowInsertType = await deep.id(
      '@deep-foundation/core',
      'AllowInsertType'
    );
    const AllowDeleteType = await deep.id(
      '@deep-foundation/core',
      'AllowDeleteType'
    );
    const SelectorFilter = await deep.id(
      '@deep-foundation/core',
      'SelectorFilter'
    );
    const Query = await deep.id('@deep-foundation/core', 'Query');
    const usersId = await deep.id('deep', 'users');

    const BasePayment = await deep.id('@deep-foundation/payments', 'Payment');
    const BaseObject = await deep.id('@deep-foundation/payments', 'Object');
    const BaseSum = await deep.id('@deep-foundation/payments', 'Sum');
    const BasePay = await deep.id('@deep-foundation/payments', 'Pay');
    const BaseUrl = await deep.id('@deep-foundation/payments', 'Url');
    const BasePayed = await deep.id('@deep-foundation/payments', 'Payed');
    const BaseError = await deep.id('@deep-foundation/payments', 'Error');
    const Storage = await deep.id('@deep-foundation/payments', 'Storage');

    const {
      data: [{ id: packageId }],
    } = await deep.insert({
      type_id: packageTypeId,
      string: { data: { value: '@deep-foundation/payments-tinkoff-c2b' } },
      in: {
        data: [
          {
            type_id: containTypeId,
            from_id: deep.linkId,
          },
        ],
      },
      out: {
        data: [
          {
            type_id: joinTypeId,
            to_id: await deep.id('deep', 'users', 'packages'),
          },
          {
            type_id: joinTypeId,
            to_id: await deep.id('deep', 'admin'),
          },
        ],
      },
    });

    console.log({ packageId });

    const {
      data: [{ id: sumProviderTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId,
          string: { data: { value: 'SumProvider' } },
        },
      },
    });

    console.log({ sumProviderTypeId });

    const {
      data: [{ id: tinkoffProviderTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId,
          string: { data: { value: 'TinkoffProvider' } },
        },
      },
    });

    console.log({ tinkoffProviderTypeId });

    const {
      data: [{ id: paymentTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId,
          string: { data: { value: 'Payment' } },
        },
      },
    });

    console.log({ paymentTypeId });

    const {
      data: [{ id: objectTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: paymentTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId,
          string: { data: { value: 'Object' } },
        },
      },
    });

    console.log({ objectTypeId });

    const {
      data: [{ id: sumTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'Sum' } },
        },
      },
    });

    console.log({ sumTypeId });

    // TODO Rest restrictions
    const {
      data: [{ id: payTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'Pay' } },
        },
      },
    });

    console.log({ payTypeId });

    const {
      data: [{ id: urlTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'Url' } },
        },
      },
    });

    console.log({ urlTypeId });

    const {
      data: [{ id: payedTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'Payed' } },
        },
      },
    });

    console.log({ payedTypeId });

    const {
      data: [{ id: errorTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'Error' } },
        },
      },
    });

    console.log({ errorTypeId });

    const {
      data: [{ id: paymentTreeId }],
    } = await deep.insert({
      type_id: treeTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId,
          string: { data: { value: 'paymentTree' } },
        },
      },
      out: {
        data: [
          {
            type_id: treeIncludeNodeTypeId,
            to_id: paymentTypeId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          },
          {
            type_id: treeIncludeUpTypeId,
            to_id: sumTypeId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          },
          {
            type_id: treeIncludeDownTypeId,
            to_id: objectTypeId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          },
          {
            type_id: treeIncludeUpTypeId,
            to_id: errorTypeId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          },
          {
            type_id: treeIncludeUpTypeId,
            to_id: payedTypeId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          },
          {
            type_id: treeIncludeUpTypeId,
            to_id: payTypeId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          },
          {
            type_id: treeIncludeUpTypeId,
            to_id: urlTypeId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          },
        ],
      },
    });

    const {
      data: [{ id: storageBusinessTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'StorageBusiness' } },
        },
      },
    });
    console.log({storageBusinessTypeId});

    const {
      data: [{ id: tokenTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'Token' } },
        },
      },
    });
    console.log({tokenTypeId});


    const {
      data: [{ id: storageClientTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'StorageClient' } },
        },
      },
    });
    console.log({storageClientTypeId});

    const {
      data: [{ id: titleTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'Title' } },
        },
      },
    });
    console.log({ titleTypeId });

    const {
      data: [{ id: incomeTypeId }],
    } = await deep.insert({
      type_id: typeTypeId,
      from_id: anyTypeId,
      to_id: anyTypeId,
      in: {
        data: {
          type_id: containTypeId,
          from_id: packageId, // before created package
          string: { data: { value: 'Income' } },
        },
      },
    });
    console.log({ incomeTypeId });


    await insertPayInsertHandler({deep, containTypeId, fileTypeId: syncTextFileTypeId, handlerInsertTypeId, handlerTypeId, notificationUrl: process.env.PAYMENTS_C2B_NOTIFICATION_URL, packageId, supportsId: dockerSupportsJs, userEmail: process.env.PAYMENTS_C2B_EMAIL, userPhone: process.env.PAYMENTS_C2B_PHONE});

    await insertNotificationHandler({deep, adminId: await deep.id('deep', 'admin'), containTypeId, fileTypeId: syncTextFileTypeId, handleRouteTypeId, handlerTypeId, notificationPort: process.env.PAYMENTS_C2B_NOTIFICATION_PORT, notificationRoute: process.env.PAYMENTS_C2B_NOTIFICATION_ROUTE, portTypeId, routerListeningTypeId, routerStringUseTypeId, routerTypeId, routeTypeId, supportsId});

    const callTests = async () => {
      console.log('callTests-start');

      const PRICE = 5500;

      const callRealizationTests = async () => {
        const testInit = async () => {
          const initOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            OrderId: uniqid(),
            Amount: PRICE,
            Description: 'Test shopping',
            CustomerKey: deep.linkId,
            Language: 'ru',
            Recurrent: 'Y',
            DATA: {
              Email: process.env.PAYMENTS_C2B_EMAIL,
              Phone: process.env.PAYMENTS_C2B_PHONE,
            },
            // Receipt: {
            // 	Items: [{
            // 		Name: 'Test item',
            // 		Price: PRICE,
            // 		Quantity: 1,
            // 		Amount: PRICE,
            // 		PaymentMethod: 'prepayment',
            // 		PaymentObject: 'service',
            // 		Tax: 'none',
            // 	}],
            // 	Email: process.env.PAYMENTS_C2B_EMAIL,
            // 	Phone: process.env.PAYMENTS_C2B_PHONE,
            // 	Taxation: 'usn_income',
            // },
          };

          const initResult = await init(initOptions);

          expect(initResult.error).to.equal(undefined);

          return initResult;
        };

        const testConfirm = async () => {
          const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
          const page = await browser.newPage();

          const initOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            Amount: PRICE,
            OrderId: uniqid(),
            CustomerKey: deep.linkId,
            PayType: 'T',
            // Receipt: {
            // 	Items: [{
            // 		Name: 'Test item',
            // 		Price: PRICE,
            // 		Quantity: 1,
            // 		Amount: PRICE,
            // 		PaymentMethod: 'prepayment',
            // 		PaymentObject: 'service',
            // 		Tax: 'none',
            // 	}],
            // 	Email: process.env.PAYMENTS_C2B_EMAIL,
            // 	Phone: process.env.PAYMENTS_C2B_PHONE,
            // 	Taxation: 'usn_income',
            // },
          };

          const initResult = await init(initOptions);

          await payInBrowser({
            browser,
            page,
            url: initResult.response.PaymentURL,
          });

          const confirmOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            PaymentId: initResult.response.PaymentId,
          };

          const confirmResult = await confirm(confirmOptions);

          expect(confirmResult.error).to.equal(undefined);
          expect(confirmResult.response.Status).to.equal('CONFIRMED');

          return confirmResult;
        };

        const testGetState = async () => {
          const initResult = await init({
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            OrderId: uniqid(),
            CustomerKey: deep.linkId,
            Amount: PRICE,
          });

          const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
          const page = await browser.newPage();
          await payInBrowser({
            browser,
            page,
            url: initResult.response.PaymentURL,
          });

          const getStateOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            PaymentId: initResult.response.PaymentId,
          };

          const getStateResult = await getState(getStateOptions);

          expect(getStateResult.error).to.equal(undefined);
        };

        const testGetCardList = async () => {
          const initResult = await init({
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            CustomerKey: deep.linkId,
            OrderId: uniqid(),
            Amount: PRICE,
            Recurrent: 'Y',
          });

          const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
          const page = await browser.newPage();
          await payInBrowser({
            browser,
            page,
            url: initResult.response.PaymentURL,
          });

          const getCardListOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            CustomerKey: deep.linkId,
          };

          const getCardListResult = await getCardList(getCardListOptions);

          expect(getCardListResult.error).to.equal(undefined);
        };

        const testResend = async () => {
          console.log('testResend-start');
          const resendOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
          };
          console.log({ resendOptions });

          const resendResult = await resend(resendOptions);
          console.log({ resendResult });

          expect(resendResult.error).to.equal(undefined);
          console.log('testResend-end');
        };

        const testCharge = async () => {
          console.log('testCharge-start');
          const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
          const page = await browser.newPage();

          const initResult = await init({
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            Amount: PRICE,
            OrderId: uniqid(),
            CustomerKey: deep.linkId,
            Recurrent: 'Y',
          });

          await payInBrowser({
            browser,
            page,
            url: initResult.response.PaymentURL,
          });

          const getCardListOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            CustomerKey: deep.linkId,
          };

          const getCardListResult = await getCardList(getCardListOptions);

          expect(getCardListResult.response[0].RebillId).to.have.length.above(0);

          const getStateOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            PaymentId: initResult.response.PaymentId,
          };

          const getStateResult = await getState(getStateOptions);

          expect(getStateResult.response.Status).to.equal('AUTHORIZED');

          const newInitResult = await init({
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            Amount: PRICE,
            OrderId: uniqid(),
            CustomerKey: deep.linkId,
          });

          const newChargeOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            PaymentId: newInitResult.response.PaymentId,
            RebillId: Number(getCardListResult.response[0].RebillId),
          };

          const chargeResult = await charge(newChargeOptions);

          expect(chargeResult.error).to.equal(undefined);
          console.log('testCharge-end');
        };

        const testAddCustomer = async () => {
          console.log('testAddCustomer-start');

          const addCustomerOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            CustomerKey: uniqid(),
          };
          console.log({ addCustomerOptions });

          const addCustomerResult = await addCustomer(addCustomerOptions);
          console.log({ addCustomerResult });

          expect(addCustomerResult.error).to.equal(undefined);
          console.log('testAddCustomer-end');
        };

        const testGetCustomer = async () => {
          console.log('testGetCustomer-start');

          const customerOptions = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            CustomerKey: uniqid(),
          };

          const addCustomerDataOptions = {
            ...customerOptions,
            Phone: process.env.PAYMENTS_C2B_PHONE,
          };

          const addResult = await addCustomer(addCustomerDataOptions);

          expect(addResult.error).to.equal(undefined);

          const getResult = await getCustomer(customerOptions);

          expect(getResult.error).to.equal(undefined);
          expect(getResult.response.Phone).to.equal(
            process.env.PAYMENTS_C2B_PHONE
          );

          console.log('testGetCustomer-end');
        };

        const testRemoveCustomer = async () => {
          console.log('testRemoveCustomer-start');

          const removeCustomerData = {
            TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
            CustomerKey: uniqid(),
          };

          const newAddCustomerData = {
            ...removeCustomerData,
            Phone: process.env.PAYMENTS_C2B_PHONE,
          };

          const addResult = await addCustomer(newAddCustomerData);

          expect(addResult.error).to.equal(undefined);

          const removeResult = await removeCustomer(removeCustomerData);

          expect(removeResult.error).to.equal(undefined);

          console.log('testRemoveCustomer-end');
        };

        await testInit();
        await testConfirm();
        await testGetState();
        await testGetCardList();
        await testResend();
        await testCharge();
        await testAddCustomer();
        await testGetCustomer();
        await testRemoveCustomer();
      };

      const callIntegrationTests = async () => {

        const createdLinkIds = [];

        const {
          data: [{ id: tinkoffProviderLinkId }],
        } = await deep.insert({
          type_id: tinkoffProviderTypeId,
          in: {
            data: [
              {
                type_id: containTypeId,
                from_id: deep.linkId,
              },
            ],
          },
        });
        console.log({ tinkoffProviderLinkId });
        createdLinkIds.push(tinkoffProviderLinkId);
        allCreatedLinkIds.push(tinkoffProviderLinkId);

        const {
          data: [{ id: sumProviderLinkId }],
        } = await deep.insert({
          type_id: sumProviderTypeId,
          in: {
            data: [
              {
                type_id: containTypeId,
                from_id: deep.linkId,
              },
            ],
          },
        });
        console.log({ sumProviderLinkId });
        createdLinkIds.push(sumProviderLinkId);
        allCreatedLinkIds.push(sumProviderLinkId);

        const {
          data: [{ id: storageBusinessLinkId }],
        } = await deep.insert({
          type_id: storageBusinessTypeId,
          in: {
            data: [
              {
                type_id: containTypeId,
                from_id: deep.linkId,
              },
            ],
          },
        });
        console.log({ storageBusinessLinkId });
        createdLinkIds.push(storageBusinessLinkId);
        allCreatedLinkIds.push(storageBusinessLinkId);

        const {
          data: [{ id: tokenLinkId }],
        } = await deep.insert({
          type_id: tokenTypeId,
          from_id: storageBusinessLinkId,
          to_id: storageBusinessLinkId,
          string: { data: { value: process.env.PAYMENTS_C2B_TERMINAL_KEY } },
          in: {
            data: [
              {
                type_id: containTypeId,
                from_id: deep.linkId,
              },
            ],
          },
        });
        console.log({ tokenLinkId });
        createdLinkIds.push(tokenLinkId);
        allCreatedLinkIds.push(tokenLinkId);

        const {
          data: [{ id: Product }],
        } = await deep.insert({
          type_id: typeTypeId,
          from_id: anyTypeId,
          to_id: anyTypeId,
          in: {
            data: [
              {
                type_id: containTypeId,
                from_id: deep.linkId,
              },
            ],
          },
        });
        console.log({ Product });
        createdLinkIds.push(Product);
        allCreatedLinkIds.push(Product);

        const {
          data: [{ id: productLinkId }],
        } = await deep.insert({
          type_id: Product,
          in: {
            data: [
              {
                type_id: containTypeId,
                from_id: deep.linkId,
              },
            ],
          },
        });
        console.log({ productLinkId });
        createdLinkIds.push(productLinkId);
        allCreatedLinkIds.push(productLinkId);

        const testInit = async ({ customerKey } = { customerKey: uniqid() }) => {
          console.log('testInit-start');

          const createdLinkIds = [];

          const {
            data: [{ id: paymentLinkId }],
          } = await deep.insert({
            type_id: paymentTypeId,
            object: { data: { value: { orderId: uniqid() } } },
            from_id: deep.linkId,
            to_id: storageBusinessLinkId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          });
          console.log({ paymentLinkId });
          createdLinkIds.push(paymentLinkId);
          allCreatedLinkIds.push(paymentLinkId);

          const {
            data: [{ id: sumLinkId }],
          } = await deep.insert({
            type_id: sumTypeId,
            from_id: sumProviderLinkId,
            to_id: paymentLinkId,
            number: { data: { value: PRICE } },
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          });
          console.log({ sumLinkId });
          createdLinkIds.push(sumLinkId);
          allCreatedLinkIds.push(sumLinkId);

          const {
            data: [{ id: objectLinkId }],
          } = await deep.insert({
            type_id: objectTypeId,
            from_id: paymentLinkId,
            to_id: productLinkId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          });
          console.log({ objectLinkId });
          createdLinkIds.push(objectLinkId);
          allCreatedLinkIds.push(objectLinkId);

          const {
            data: [{ id: payLinkId }],
          } = await deep.insert({
            type_id: payTypeId,
            from_id: deep.linkId,
            to_id: sumLinkId,
            in: {
              data: [
                {
                  type_id: containTypeId,
                  from_id: deep.linkId,
                },
              ],
            },
          });
          console.log({ payLinkId });
          createdLinkIds.push(payLinkId);
          allCreatedLinkIds.push(payLinkId);

          var urlLinkSelectQuery;
          for (let i = 0; i < 10; i++) {
            urlLinkSelectQuery = await deep.select({
              type_id: urlTypeId,
              to_id: payLinkId,
            });

            if (urlLinkSelectQuery.data.length > 0) {
              break;
            }

            await sleep(1000);
          }

          expect(urlLinkSelectQuery.data.length).to.greaterThan(0);

          createdLinkIds.push(urlLinkSelectQuery.data[0].id);
          allCreatedLinkIds.push(urlLinkSelectQuery.data[0].id);

          const createdLinks = (await deep.select(createdLinkIds)).data;
          console.log({ createdLinks });

          console.log('testInit-end');

          return {
            createdLinks
          }
        };

        const testFinishAuthorize = async ({ customerKey } = { customerKey: uniqid() }) => {
          console.log('testFinishAuthorize-start');
          const { createdLinks } = await testInit({ customerKey });

          const urlLink = createdLinks.find(link => link.type_id === urlTypeId);
          expect(urlLink).to.not.be.equal(undefined)

          const url = urlLink.value.value;
          console.log({ url });

          const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
          const page = await browser.newPage();
          await payInBrowser({
            browser,
            page,
            url,
          });

          console.log({ createdLinks });

          console.log('testFinishAuthorize-end');

          return {
            createdLinks
          }
        };

        const testConfirm = async ({ customerKey } = { customerKey: uniqid() }) => {
          console.log('testConfirm-start');
          const { createdLinks } = await testFinishAuthorize({ customerKey });

          const createdLinkIds = [];

          const payLink = createdLinks.find(link => link.type_id === payTypeId);
          expect(payLink).to.not.be.equal(undefined);

          var payedLinkSelectQuery;
          for (let i = 0; i < 10; i++) {
            payedLinkSelectQuery = await deep.select({
              type_id: payedTypeId,
              to_id: payLink.id
            });

            if (payedLinkSelectQuery.data.length > 0) {
              break;
            }

            await sleep(1000);
          }

          expect(payedLinkSelectQuery.data.length).to.greaterThan(0);

          createdLinkIds.push(payedLinkSelectQuery.data[0].id);
          allCreatedLinkIds.push(payedLinkSelectQuery.data[0].id);

          createdLinks.push(...(await deep.select(createdLinkIds)).data);

          console.log({ createdLinks });

          console.log('testConfirm-end');

          return {
            createdLinks
          }
        };

        /*
      const testGetState = async () => {
      console.log('testGetState-start');
      await testFinishAuthorize();
  
      const {
        data: [payLink],
      } = await deep.select({ type_id: Pay });
  
      const bankPaymentId = await getBankPaymentId(
        payLink?.value?.value ?? payLink.id
      );
  
      const getStateOptions = {
        TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
        PaymentId: bankPaymentId,
      };
  
      const getStateResult = await getState(getStateOptions);
  
      expect(getStateResult.error).to.equal(undefined);
      console.log('testGetState-end');
      };
  
      const testGetCardList = async () => {
      console.log('testGetCardList-end');
      await testFinishAuthorize();
  
      const getCardListOptions = {
        TerminalKey: process.env.PAYMENTS_C2B_TERMINAL_KEY,
        CustomerKey: deep.linkId,
      };
  
      const getCardListResult = await getCardList(getCardListOptions);
  
      expect(getCardListResult.error).to.equal(undefined);
      console.log('testGetCardList-end');
      };
      */

      const callTest = async (testFunction) => {
        const { createdLinks } = await testFunction();
        for (const createdLink of createdLinks) {
          if(createdLink.type_id === payTypeId) {
            const errorLinkSelectQuery = await deep.select({
              type_id: errorTypeId,
              to_id: createdLink.id
            });
            createdLinks.push(...errorLinkSelectQuery.data);
          }
        }
        await deep.delete(createdLinks.map((link) => link.id));
      }

      await callTest(testInit);
      await callTest(testFinishAuthorize);
      await callTest(testConfirm);

      await deep.delete(createdLinkIds);

      /*await testGetState();
      await testGetCardList();*/
      };

      // await callRealizationTests();
      await callIntegrationTests();
    };

    await callTests();

  } catch (error) {
    await deep.delete(allCreatedLinkIds);
    console.log(error);
    process.exit(1);
  }
};

installPackage();