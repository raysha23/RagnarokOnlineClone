using Microsoft.Web.WebView2.Core;
using System.Text.Json;

namespace RagnarokOnlineClone
{
    public partial class Home : Form
    {
        public Home()
        {
            InitializeComponent();

            // Fullscreen
            this.FormBorderStyle = FormBorderStyle.None;
            this.WindowState = FormWindowState.Maximized;

            this.Load += Home_Load;
        }

        // ESC closes application
        protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
        {
            if (keyData == Keys.Escape)
            {
                this.Close();
                return true;
            }

            return base.ProcessCmdKey(ref msg, keyData);
        }

        private async void Home_Load(object sender, EventArgs e)
        {
            await InitializeWebViewAsync();
        }

        private async Task InitializeWebViewAsync()
        {
            try
            {
                await webView21.EnsureCoreWebView2Async();

                string uiFolder = Path.Combine(Application.StartupPath, "UI");

                if (!Directory.Exists(uiFolder))
                {
                    MessageBox.Show("UI folder not found:\n" + uiFolder);
                    return;
                }

                webView21.CoreWebView2.SetVirtualHostNameToFolderMapping(
                    "app",
                    uiFolder,
                    CoreWebView2HostResourceAccessKind.Allow
                );

                webView21.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
                webView21.CoreWebView2.Settings.AreDevToolsEnabled = false;

          //        // Disable Ctrl + / Ctrl - zoom
          //        webView21.CoreWebView2.Settings.IsZoomControlEnabled = false;

          //        // Disable scrolling
          //        string disableScrollJs = @"
          //    document.body.style.overflow = 'hidden';
          //    document.documentElement.style.overflow = 'hidden';
          //";
          //        await webView21.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(disableScrollJs);

                webView21.CoreWebView2.WebMessageReceived += WebMessageReceived;

                webView21.Source = new Uri("https://app/home.html");
            }
            catch (Exception ex)
            {
                MessageBox.Show("WebView initialization failed:\n" + ex.Message);
            }
        }

        // JS → C#
        private async void WebMessageReceived(
        object sender,
        CoreWebView2WebMessageReceivedEventArgs e)
        {
            try
            {
                using JsonDocument doc = JsonDocument.Parse(e.WebMessageAsJson);
                JsonElement root = doc.RootElement;

                if (!root.TryGetProperty("type", out JsonElement typeElement))
                    return;

                string type = typeElement.GetString();

                switch (type)
                {
                    case "greet":
                        {
                            string name = root.GetProperty("value").GetString() ?? "Player";

                            MessageBox.Show("Hello " + name);

                            // Safe JS string injection
                            string safeName = JsonSerializer.Serialize($"Welcome {name}!");

                            await webView21.CoreWebView2.ExecuteScriptAsync(
                                $"showMessage({safeName})"
                            );
                        }
                        break;

                    case "requestMessage":
                        {
                            string message = JsonSerializer.Serialize("This message is from C# backend!");

                            await webView21.CoreWebView2.ExecuteScriptAsync(
                                $"showMessage({message})"
                            );
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Message handling error:\n" + ex.Message);
            }
        }
    }
}
