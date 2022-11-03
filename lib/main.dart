
import 'package:flutter/material.dart';
import 'package:mpesa_flutter_plugin/mpesa_flutter_plugin.dart';
import 'dart:async';

void main() {
  MpesaFlutterPlugin.setConsumerKey("Enter CustomerKey");
  MpesaFlutterPlugin.setConsumerSecret("Enter CustomerSecret");

  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  createState() => MyAppState();
}

class MyAppState extends State<MyApp> {
  //late String _accessToken;
  Future<dynamic> lipaNaMpesa(
      {required double amount, required String phone}) async {
    dynamic transactionInitialisation;
    try {
      transactionInitialisation = await MpesaFlutterPlugin.initializeMpesaSTKPush(
          businessShortCode: "174379",
          transactionType: TransactionType.CustomerPayBillOnline,
          amount: amount,
          partyA: phone,
          partyB: "174379",
          callBackURL: Uri(scheme: "https", host: "1234.1234.co.ke", path: "/1234.php"),
          accountReference: "Liz Wahome Clothline",
          phoneNumber: phone,
          baseUri: Uri(scheme: "https", host: "sandbox.safaricom.co.ke"),
          transactionDesc: "purchase",
          passKey:
              "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919");
      print("result: $transactionInitialisation");
 
      return transactionInitialisation;
    } catch (e) {
      print("CAUGHT EXCEPTION: $e");
    }
  }


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(primaryColor: const Color(0xFF481E4D)),
        home: Scaffold(
            appBar: AppBar(
              title: const Text('Mpesa Payment Demo'),
              centerTitle: true,
            ),
            body: Center(
                child: ElevatedButton(
                    onPressed: () async {
                      lipaNaMpesa(amount: 1, phone: "Enter phoneNumber"); 
                    },
                    child: const Text(
                      "Lipa na Mpesa",
                      style: TextStyle(color: Colors.white),
                    )))));
  }
}
