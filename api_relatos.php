<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexao.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$acao = $_GET['acao'] ?? 'listar_aprovados';

if ($metodo === 'GET') {
    if ($acao === 'listar_todos') {
        $stmt = $pdo->query("SELECT * FROM relatos_comunidade ORDER BY data_envio DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $stmt = $pdo->query("SELECT * FROM relatos_comunidade WHERE status_curadoria = 'aprovado' ORDER BY data_envio DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    exit;
}

if ($metodo === 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);

    if ($acao === 'novo_relato') {
        $stmt = $pdo->prepare("INSERT INTO relatos_comunidade (autor, email, perfil_usuario, titulo_memoria, bairro_referencia, periodo_historico, relato, midia_url, aceite_lgpd, status_curadoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'pendente')");
        $stmt->execute([
            $dados['autor'],
            $dados['email'],
            $dados['perfil_usuario'],
            $dados['titulo_memoria'],
            $dados['bairro_referencia'],
            $dados['periodo_historico'],
            $dados['relato'],
            $dados['midia_url'] ?? ''
        ]);
        echo json_encode(['sucesso' => true, 'mensagem' => 'Relato gravado no MySQL com status pendente.']);
        exit;
    }

    if ($acao === 'moderar') {
        $stmt = $pdo->prepare("UPDATE relatos_comunidade SET status_curadoria = ? WHERE id = ?");
        $stmt->execute([$dados['status'], (int)$dados['id']]);
        echo json_encode(['sucesso' => true]);
        exit;
    }
}
?>