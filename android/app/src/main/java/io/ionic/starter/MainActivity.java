package io.ionic.starter;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
public class MainActivity extends BridgeActivity {
   public void onCreate(Bundle saveInstanceState){
    super.onCreate(saveInstanceState);

    registerPlugin(GoogleAuth.class);
  }
}
