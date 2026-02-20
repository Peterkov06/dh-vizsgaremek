using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ViewModels;

namespace adminApp.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{

    [ObservableProperty]
    public ViewModelBase? _currentPage;

    private readonly HomeViewModel _homeView = new HomeViewModel();

    [RelayCommand]
    public void GoToHome()
    {
        CurrentPage = _homeView;
    }
}
